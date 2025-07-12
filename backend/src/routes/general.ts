import { Router } from 'express';
import { API_ROUTES } from '../config/routes';
import { snapshotService } from '../services/snapshots';

const router = Router();

// GET /api/health
router.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    database: 'connected'
  });
});

// GET /api/db-check
router.get('/db-check', async (_req, res) => {
  try {
    const snapshots = await snapshotService.getSnapshots();
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

router.get('/', (_req, res) => {
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

export default router; 