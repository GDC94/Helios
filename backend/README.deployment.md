# Backend Deployment - Render

## 📋 Archivos de configuración

- `render.yaml` - Infraestructura como código para Render
- `scripts/render-build.sh` - Script de build personalizado
- `.env.example` - Variables de entorno necesarias

## 🚀 Deploy automático

1. Push tu código a GitHub
2. Conecta el repo en Render
3. Render detectará automáticamente `render.yaml`
4. Se creará:
   - PostgreSQL database
   - Web service con auto-deploy

## 🔍 Variables de entorno configuradas

```yaml
NODE_ENV: production
DATABASE_URL: auto-generada por PostgreSQL de Render
GRAPH_ENDPOINT: https://api.studio.thegraph.com/query/62454/uniswap-v2-mainnet/version/latest  
SNAPSHOT_INTERVAL: "60"
PORT: "10000"
```

## ✅ Endpoints para verificar

```bash
# Health check
curl https://sentora-backend.onrender.com/api/health

# Ver datos
curl https://sentora-backend.onrender.com/api/metrics/snapshots
```

## 🐛 Troubleshooting

- **Build fails**: Verifica que `npm run build` funcione localmente
- **DB connection fails**: Chequea que DATABASE_URL esté configurada
- **Cron job no funciona**: Revisa logs en Render dashboard 