import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generalRouter, metricsRouter } from './routes';
import { SERVER_CONFIG } from './config/routes';
import { snapshotService } from './services/snapshots';

dotenv.config();

const app = express();
const PORT = process.env.PORT || SERVER_CONFIG.DEFAULT_PORT;

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ 
    message: 'Sentora Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      dbCheck: '/api/db-check',
      snapshots: '/api/metrics/snapshots',
      pairs: '/api/metrics/pairs',
      chart: '/api/metrics/chart'
    }
  });
});

// Routes
app.use('/api', generalRouter);
app.use('/api/metrics', metricsRouter);

const server = app.listen(PORT, () => {
  const host = SERVER_CONFIG.DEFAULT_HOST;
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://${host}:${PORT}/api/health`);
  console.log(`🔍 DB check: http://${host}:${PORT}/api/db-check`);
  console.log(`📈 Snapshots: http://${host}:${PORT}/api/metrics/snapshots`);
  console.log(`👥 Pairs: http://${host}:${PORT}/api/metrics/pairs`);
  console.log(`📊 Chart: http://${host}:${PORT}/api/metrics/chart`);
  
  console.log(`🕐 Starting snapshot job...`);
  snapshotService.startSnapshotJob();
});

// Gracefull shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;
