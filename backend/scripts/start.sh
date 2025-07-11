#!/usr/bin/env bash
set -e

echo "🚀 Iniciando Sentora Backend..."

# 1. Ir al directorio del backend
cd "$(dirname "$0")/.."

# 2. Verificar que existe .env
if [ ! -f .env ]; then
  echo "❌ Archivo .env no encontrado. Creando desde .env.example..."
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ Archivo .env creado. Por favor, revisa las configuraciones."
  else
    echo "❌ Tampoco existe .env.example. Por favor, crea el archivo .env."
    exit 1
  fi
fi

# 3. Limpiar contenedores existentes
echo "🧹 Limpiando contenedores existentes..."
docker compose down -v --remove-orphans

# 4. Levantar servicios
echo "📦 Levantando servicios..."
docker compose up -d --build

# 5. Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL arranque..."
until docker exec sentora-postgres pg_isready -U sentora_user -d sentora_db >/dev/null 2>&1; do
  echo "   Esperando PostgreSQL..."
  sleep 2
done
echo "✅ PostgreSQL está listo"

# 6. Aplicar migraciones
echo "🗄️  Aplicando migraciones..."
docker exec sentora-backend npx prisma migrate deploy

# 7. Generar cliente Prisma
echo "🔧 Generando cliente Prisma..."
docker exec sentora-backend npx prisma generate

# 8. Verificar que el backend esté funcionando
echo "🔍 Verificando servicios..."
sleep 5

# Verificar health check
if curl -s http://localhost:3001/api/health > /dev/null; then
  echo "✅ Backend funcionando correctamente"
else
  echo "❌ Backend no responde. Verificando logs..."
  docker logs sentora-backend --tail 10
  exit 1
fi

# 9. Mensaje final
echo "
🎉 ¡Proyecto levantado correctamente!

📋 Endpoints disponibles para Insomnia:
 • Health Check  → GET  http://localhost:3001/api/health
 • DB Check      → GET  http://localhost:3001/api/db-check  
 • All Snapshots → GET  http://localhost:3001/api/metrics/snapshots
 • Pair Snapshots→ GET  http://localhost:3001/api/metrics/snapshots?pairAddress=0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc
 • Monitored Pairs→ GET  http://localhost:3001/api/metrics/pairs
 • Root Info     → GET  http://localhost:3001/

🛠️  Herramientas útiles:
 • Ver logs      → docker logs -f sentora-backend
 • Ver DB        → docker exec -it sentora-postgres psql -U sentora_user -d sentora_db
 • Parar todo    → docker compose down

¡Listo para probar con Insomnia! 🚀
"
