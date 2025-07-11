import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import metricsRouter from './routes/metrics';
import { getSnapshots } from './services/snapshotService';
import { startSnapshotJob } from './services/snapshotJob';
import { API_ROUTES, SERVER_CONFIG } from './config/routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || SERVER_CONFIG.DEFAULT_PORT;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


app.use(API_ROUTES.METRICS.BASE, metricsRouter);

app.get(API_ROUTES.HEALTH, (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    database: 'connected'
  });
});

app.get(API_ROUTES.DB_CHECK, async (req, res) => {
  try {
    const snapshots = await getSnapshots();
    res.json({
      status: 'ok',
      totalSnapshots: snapshots.length,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: 'Database connection failed',
      timestamp: new Date()
    });
  }
});

app.get(API_ROUTES.ROOT, (req, res) => {
  res.json({ 
    message: 'Sentora Backend API',
    version: '1.0.0',
    endpoints: {
      health: API_ROUTES.HEALTH,
      dbCheck: API_ROUTES.DB_CHECK,
      snapshots: API_ROUTES.METRICS.SNAPSHOTS,
      pairs: API_ROUTES.METRICS.PAIRS,
      chart: API_ROUTES.METRICS.CHART
    }
  });
});

const server = app.listen(PORT, () => {
  const host = SERVER_CONFIG.DEFAULT_HOST;
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://${host}:${PORT}${API_ROUTES.HEALTH}`);
  console.log(`DB check: http://${host}:${PORT}${API_ROUTES.DB_CHECK}`);
  console.log(`Mis Snapshots: http://${host}:${PORT}${API_ROUTES.METRICS.SNAPSHOTS}`);
  console.log(`Pairs: http://${host}:${PORT}${API_ROUTES.METRICS.PAIRS}`);
  console.log(`chart: http://${host}:${PORT}${API_ROUTES.METRICS.CHART}`);
  
  console.log(`🕐 Starting snapshot job...`);
  startSnapshotJob(prisma);
});


process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;
