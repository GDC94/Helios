# Frontend Deployment - Vercel

## 📋 Archivos de configuración

- `vercel.json` - Configuración de Vercel
- `.env.production` - Variables para producción
- `.env.example` - Template de variables

## 🚀 Deploy options

### Opción 1: Vercel CLI

```bash
npm i -g vercel
cd frontend
vercel --prod
```

### Opción 2: GitHub integration

1. Conectar repo en vercel.com
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`

## 🔧 Variables de entorno

En Vercel dashboard → Project Settings → Environment Variables:

```
VITE_API_BASE_URL = https://sentora-backend.onrender.com/api
NODE_ENV = production
```

## ✅ Verificar deployment

1. URL estará en formato: `https://sentora-frontend.vercel.app`
2. Verificar que no hay errores en la consola del navegador
3. Probar que los calls de API funcionan

## 🐛 Troubleshooting

- **Build fails**: Verifica que `npm run build` funcione localmente
- **API calls fail**: Chequea VITE_API_BASE_URL y que el backend esté up
- **CORS errors**: Verificar configuración CORS en backend
