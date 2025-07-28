# 🚀 Guía de Deployment - Sentora

Esta guía te lleva paso a paso para deployar **Sentora** en producción:
- **Backend** en [Render](https://render.com/) con PostgreSQL
- **Frontend** en [Vercel](https://vercel.com/)

---

## 📋 Pre-requisitos

### Cuentas necesarias:
- ✅ [Render](https://render.com/) (gratis)
- ✅ [Vercel](https://vercel.com/) (gratis)
- ✅ [GitHub](https://github.com/) (para conectar repos)

### Preparación del código:
```bash
# 1. Asegúrate de que todos los cambios estén commiteados
git add .
git commit -m "feat: prepare for deployment"
git push origin main

# 2. Verifica que el proyecto funcione localmente
cd backend && npm run build  # ✅ Debe compilar sin errores
cd ../frontend && npm run build  # ✅ Debe generar dist/
```

---

## 🗄️ Parte 1: Backend en Render

### 1.1 Crear cuenta y proyecto en Render

1. Ve a [render.com](https://render.com/) y crea una cuenta
2. Conecta tu cuenta de GitHub
3. Click en **"New"** → **"Blueprint"**
4. Conecta tu repositorio `sentora`
5. Asegúrate de que detecte el archivo `backend/render.yaml`

### 1.2 Configurar variables de entorno

Render detectará automáticamente la mayoría de variables del `render.yaml`, pero verifica:

```env
NODE_ENV=production
GRAPH_ENDPOINT=https://api.studio.thegraph.com/query/62454/uniswap-v2-mainnet/version/latest
SNAPSHOT_INTERVAL=60
```

### 1.3 Deploy del backend

1. Click **"Apply Blueprint"**
2. Render creará automáticamente:
   - 🗄️ **PostgreSQL database** (`sentora-postgres`)
   - 🚀 **Web service** (`sentora-backend`)
3. El deploy tardará ~5-10 minutos

### 1.4 Verificar deployment

```bash
# Cuando el deploy termine, verifica:
curl https://sentora-backend.onrender.com/api/health
# Respuesta esperada: {"status":"ok","database":"connected"}

curl https://sentora-backend.onrender.com/api/metrics/snapshots
# Debería mostrar datos capturados (puede estar vacío al inicio)
```

### 1.5 Activar snapshot job

El cron job debería iniciarse automáticamente, pero puedes verificar en los logs de Render:
```
🕐 Starting snapshot job...
📊 Snapshot job completed. Captured X pairs
```

---

## 🎨 Parte 2: Frontend en Vercel

### 2.1 Actualizar configuración del frontend

```bash
cd frontend

# Crear archivo de variables para producción
cat > .env.production << EOF
VITE_API_BASE_URL=https://sentora-backend.onrender.com/api
NODE_ENV=production
EOF

# Commitear los cambios
git add .
git commit -m "feat: configure production environment"
git push origin main
```

### 2.2 Deploy en Vercel

#### Opción A: Vercel CLI (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login y deploy
cd frontend
vercel login
vercel --prod

# Seguir el wizard:
# - Project name: sentora-frontend
# - Framework: React
# - Build command: npm run build  
# - Output directory: dist
```

#### Opción B: Vercel Dashboard
1. Ve a [vercel.com](https://vercel.com/)
2. Click **"Import Project"**
3. Conecta tu repo `sentora`
4. Configura:
   - **Root Directory**: `frontend`
   - **Framework**: React
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Configurar variables de entorno en Vercel

En el dashboard de Vercel:
1. Ve a **Project Settings** → **Environment Variables**
2. Agrega:
   ```
   VITE_API_BASE_URL = https://sentora-backend.onrender.com/api
   NODE_ENV = production
   ```

### 2.4 Redeploy con nuevas variables

```bash
# Si usaste CLI:
vercel --prod

# Si usaste Dashboard:
# Ve a Deployments y click "Redeploy"
```

---

## ✅ Verificación final

### Backend funcionando:
```bash
curl https://sentora-backend.onrender.com/api/health
curl https://sentora-backend.onrender.com/api/metrics/global
```

### Frontend funcionando:
1. Ve a tu URL de Vercel (ej: `https://sentora-frontend.vercel.app`)
2. Verifica que:
   - ✅ La página carga sin errores
   - ✅ El dashboard muestra datos (puede tardar ~1 hora en capturar datos)
   - ✅ Los gráficos funcionan
   - ✅ No hay errores en la consola del navegador

---

## 🔧 Troubleshooting

### Backend Issues

**"Build failed" en Render:**
```bash
# Verifica que compile localmente:
cd backend
npm ci
npm run build
# Si falla, arregla errores antes de deployar
```

**"Database connection failed":**
- Verifica que la variable `DATABASE_URL` esté conectada al PostgreSQL de Render
- Revisa logs en Render dashboard

**"No snapshots being captured":**
- Verifica logs del cron job en Render
- The Graph API puede tener rate limits

### Frontend Issues

**"API calls failing":**
- Verifica que `VITE_API_BASE_URL` apunte a la URL correcta de Render
- Chequea que el backend esté funcionando
- Revisa CORS si hay errores de cross-origin

**"Build failed" en Vercel:**
```bash
# Verifica que compile localmente:
cd frontend
npm ci
npm run build
# Si falla, arregla errores TypeScript primero
```

### Performance Issues

**"Cold starts" en Render:**
- Render free tier tiene cold starts (~1-2 min)
- Las primeras requests pueden ser lentas
- Considera upgradeear a plan pagado para producción real

---

## 🌐 URLs Finales

Una vez deployado, tendrás:

- **Frontend**: `https://sentora-frontend.vercel.app` 
- **Backend**: `https://sentora-backend.onrender.com`
- **API Health**: `https://sentora-backend.onrender.com/api/health`
- **API Docs**: `https://sentora-backend.onrender.com` (endpoint list)

---

## 🔄 Deployments automaticos

### Backend (Render):
- ✅ Auto-deploy habilitado en `render.yaml`
- Cada push a `main` triggerea un nuevo deploy

### Frontend (Vercel):
- ✅ Auto-deploy habilitado por defecto
- Cada push a `main` triggerea un nuevo deploy

---

## 🎯 Próximos pasos

### Optimizaciones recomendadas:

1. **Dominio personalizado** (opcional):
   - Conectar tu dominio en Vercel
   - Actualizar CORS en backend si es necesario

2. **Monitoring** (opcional):
   - Agregar Sentry para error tracking
   - Configurar alerts en Render para downtime

3. **Performance**:
   - Considerar plan pagado de Render para evitar cold starts
   - Optimizar queries de base de datos si crece el volumen

4. **Seguridad**:
   - Configurar rate limiting
   - Agregar autenticación si es necesario

---

**¡Listo! 🎉 Sentora está now live en producción.** 