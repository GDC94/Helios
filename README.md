# Sentora FullStack exercise - German Derbes Catoni 🚀

Dashboard AMM para monitoreo de liquidez y APR de pares Uniswap v2 con datos en tiempo real de The Graph.

## Inicio rápido

### Prerequisitos
- Docker y Docker Compose instalados
- Puertos 3001 (backend) y 5173 (frontend) disponibles

###  **Comando para levantar todo:**

```bash
# Clonar el repositorio
git clone <url>
cd sentora

cd backend && ./scripts/start.sh
```

Este comando:
- ✅ Levanta PostgreSQL + Redis + Backend automáticamente
- ✅ Configura base de datos con migraciones
- ✅ Inicia captura de datos de The Graph
- ✅ Verifica que todo funcione
- ✅ Muestra endpoints para testing

### 🖥️ **Frontend (en nueva terminal):**

```bash
# Mientras el backend arranca, en otra terminal:
cd frontend
npm install
npm run dev
# Frontend disponible en http://localhost:5173
```

### 🔍 **Verificar que todo funciona:**

```bash
# ✅ Backend health check
curl http://localhost:3001/api/health

# ✅ Ver datos capturados
curl http://localhost:3001/api/metrics/snapshots
```

---

## 📊 Stack Tecnológico

### Backend
- **Node.js + TypeScript + Express** - API REST
- **PostgreSQL + Prisma ORM** - Base de datos
- **GraphQL (The Graph)** - Datos DeFi en tiempo real
- **Docker Compose** - Orquestación completa
- **Cron Jobs** - Captura automática de snapshots

### Frontend
- **React + TypeScript** - Interfaz moderna
- **TailwindCSS** - Estilos responsive
- **Recharts** - Visualización de datos
- **React Query** - Gestión de estado servidor
- **Shadcn/ui** - Componentes consistentes

---

## 🏗️ Arquitectura

```
┌─────────────────┐    GraphQL    ┌──────────────┐
│   The Graph     │◄─────────────┤   Backend    │
│   (Uniswap v2)  │               │   Node.js    │
└─────────────────┘               │              │
                                  │  ┌────────┐  │
                ┌─────────────────┤  │ Cron   │  │
                │                 │  │ Jobs   │  │
                │                 │  └────────┘  │
                │                 └──────────────┘
                │                        │
                │                        │ REST API
                │                        ▼
    ┌───────────▼────────┐     ┌─────────────────┐
    │   PostgreSQL       │     │    Frontend     │
    │   (Snapshots)      │     │    React        │
    └────────────────────┘     │                 │
                               │  ┌──────────┐   │
                               │  │ Charts   │   │
                               │  │ Filters  │   │
                               │  │ APR Calc │   │
                               │  └──────────┘   │
                               └─────────────────┘
```

---

## 📈 Funcionalidades Principales

### ⚡ **Tiempo Real**
- Captura automática de datos cada 60 minutos
- Snapshots de liquidez, volumen y fees
- Cálculo automático de APR

### 📊 **Dashboard Interactivo**
- Gráficos responsivos con Recharts
- Filtros temporales: 7d, 1m, 3m, 6m, 1y, YTD, Custom, All
- Date picker para rangos personalizados
- Tooltips con información detallada

### 🎯 **Métricas Avanzadas**
- APR calculado con moving averages
- Visualización de gaps en datos faltantes
- Escalas Y uniformes y optimizadas
- Formateo inteligente de fechas

---

## 🗂️ Estructura del Proyecto

```
sentora/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── routes/       # Endpoints REST
│   │   ├── services/     # Lógica de negocio
│   │   ├── graphql/      # Cliente The Graph
│   │   └── types/        # TypeScript types
│   ├── prisma/           # Schema + migraciones
│   ├── scripts/
│   │   └── start.sh      # 🎯 Setup automático
│   └── docker-compose.yml
├── frontend/             # React + TypeScript
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom hooks
│   │   └── pages/        # Páginas
│   └── package.json
└── README.md            # 📖 Este archivo
```

---

## 🔧 Comandos de Desarrollo

### Backend
```bash
cd backend

# 🚀 Inicio completo (recomendado)
./scripts/start.sh

# 🛠️ Solo desarrollo local
npm run dev

# 📊 Ver logs en tiempo real
docker logs -f sentora-backend

# 🗄️ Acceso directo a PostgreSQL
docker exec -it sentora-postgres psql -U sentora_user -d sentora_db

# 🧹 Limpiar y resetear todo
docker compose down -v
```

### Frontend
```bash
cd frontend

# Desarrollo
npm run dev

# Build para producción
npm run build

# 🧪 Testing
npm test              # modo wathc
npm run test:run      # Ejecutar todos los tests
npm run test:ui       # Interfaz gráfica de tests
```

---

## 🧪 Testing

### Stack de Testing
- **Vitest** - Test runner moderno y rápido (compatible con Vite)
- **@testing-library/react** - Testing de componentes React
- **@testing-library/jest-dom** - Matchers adicionales para DOM
- **@testing-library/user-event** - Simulación de interacciones de usuario
- **jsdom** - Entorno DOM virtual

### Comandos de Testing
```bash
cd frontend

# Ejecutar todos los tests
npm test

# Ejecutar tests una sola vez
npm run test:run

# Interfaz gráfica de tests (navegador)
npm run test:ui

# Reporte de cobertura
npm run coverage  # Requiere: npm install --save-dev @vitest/coverage-v8
```

### Estructura de Tests
```
src/
├── App.test.tsx                                    # Test principal de la app
├── components/
│   ├── commons/SectionTitle/SectionTitle.test.tsx # Tests de componentes comunes
│   └── Dashboard/MetricsCard/MetricsCard.test.tsx # Tests de componentes dashboard
└── test/
    └── setup.ts                                   # Configuración global de tests
```

### Mocks Configurados
- **IntersectionObserver** - Para componentes con framer-motion
- **ResizeObserver** - Para componentes responsivos
- **matchMedia** - Para tests de media queries
- **requestAnimationFrame** - Para animaciones

### Escribir Tests
```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("MiComponente", () => {
  it("renders correctly", () => {
    render(<MiComponente />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

---

## API Endpoints Disponibles

### 🔍 **Health & Status**
- `GET /api/health` - Estado del servicio
- `GET /api/db-check` - Verificar base de datos
- `GET /` - Información general

### 📊 **Métricas**
- `GET /api/metrics/snapshots` - Todos los snapshots
- `GET /api/metrics/snapshots?pairAddress=0x...` - Por par específico
- `GET /api/metrics/pairs` - Pares monitoreados
- `GET /api/metrics/chart?timeRange=7d` - Datos para gráficos
- `GET /api/metrics/chart?timeRange=custom&from=2025-07-01&to=2025-07-05` - Rango personalizado

---



### **Endpoints para Insomnia/Postman**

```http
### Health Check
GET http://localhost:3001/api/health

### Ver Snapshots Recientes
GET http://localhost:3001/api/metrics/snapshots

### Datos para Chart (7 días)
GET http://localhost:3001/api/metrics/chart?timeRange=7d

### Datos Custom Range
GET http://localhost:3001/api/metrics/chart?timeRange=custom&from=2025-07-02&to=2025-07-08

### Pares Monitoreados
GET http://localhost:3001/api/metrics/pairs
```
---

## Contacto

**German Derbes Catoni**
- 📧 Email: germanderbescatoni@gmail.com
- 🐙 GitHub: [https://github.com/GDC94]

---