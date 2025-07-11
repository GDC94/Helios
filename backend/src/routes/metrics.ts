import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PAIR_ADDRESSES } from '../config';
import { chartService } from '../services/chartService';
import { TimeRange } from '../types/chart';

const router = Router();
const prisma = new PrismaClient();

// GET /api/metrics/snapshots
router.get('/snapshots', async (req, res) => {
  try {
    const { pairAddress, from, to } = req.query;
    
    const whereClause: any = {};
    if (pairAddress && typeof pairAddress === 'string') {
      whereClause.pairAddress = pairAddress;
    }

    // Filtros de fecha
    if (from || to) {
      whereClause.timestamp = {};
      if (from && typeof from === 'string') {
        whereClause.timestamp.gte = new Date(from);
      }
      if (to && typeof to === 'string') {
        whereClause.timestamp.lte = new Date(to);
      }
    }

    const snapshots = await prisma.snapshot.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: 1000 // Aumentamos el límite
    });

    return res.json({
      success: true,
      data: snapshots,
      count: snapshots.length
    });
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch snapshots'
    });
  }
});

// GET /api/metrics/apr/all - APR para todos los pares configurados
router.get('/apr/all', async (req, res) => {
  try {
    const { from, to, movingAverage = '24' } = req.query;
    
    const allPairsData = [];
    
    for (const pairAddress of PAIR_ADDRESSES) {
      const whereClause: any = { pairAddress };
      
      // Filtros de fecha
      if (from || to) {
        whereClause.timestamp = {};
        if (from && typeof from === 'string') {
          whereClause.timestamp.gte = new Date(from);
        }
        if (to && typeof to === 'string') {
          whereClause.timestamp.lte = new Date(to);
        }
      }

      const snapshots = await prisma.snapshot.findMany({
        where: whereClause,
        orderBy: { timestamp: 'asc' },
        take: 1000
      });

      if (snapshots.length > 0) {
        const movingHours = parseInt(movingAverage as string) || 24;
        const aprData = calculateAPRWithMovingAverage(snapshots, movingHours);
        
        allPairsData.push({
          pairAddress,
          aprData,
          snapshotCount: snapshots.length
        });
      }
    }

    return res.json({
      success: true,
      data: allPairsData,
      movingAverageHours: parseInt(movingAverage as string) || 24,
      totalPairs: allPairsData.length
    });
  } catch (error) {
    console.error('Error calculating APR for all pairs:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate APR for all pairs'
    });
  }
});

// GET /api/metrics/apr - Calcular APR con moving averages
router.get('/apr', async (req, res) => {
  try {
    const { pairAddress, from, to, movingAverage = '24' } = req.query;
    
    if (!pairAddress || typeof pairAddress !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'pairAddress is required'
      });
    }

    const whereClause: any = { pairAddress };
    
    // Filtros de fecha
    if (from || to) {
      whereClause.timestamp = {};
      if (from && typeof from === 'string') {
        whereClause.timestamp.gte = new Date(from);
      }
      if (to && typeof to === 'string') {
        whereClause.timestamp.lte = new Date(to);
      }
    }

    const snapshots = await prisma.snapshot.findMany({
      where: whereClause,
      orderBy: { timestamp: 'asc' },
      take: 1000
    });

    if (snapshots.length === 0) {
      return res.json({
        success: true,
        data: [],
        count: 0
      });
    }

    // Convertir movingAverage a número de horas
    const movingHours = parseInt(movingAverage as string) || 24;
    
    // Calcular APR con moving average
    const aprData = calculateAPRWithMovingAverage(snapshots, movingHours);

    return res.json({
      success: true,
      data: aprData,
      count: aprData.length,
      movingAverageHours: movingHours
    });
  } catch (error) {
    console.error('Error calculating APR:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate APR'
    });
  }
});

// GET /api/metrics/pairs - Lista pares monitoreados
router.get('/pairs', async (req, res) => {
  try {
    const pairs = await prisma.snapshot.groupBy({
      by: ['pairAddress'],
      _count: { id: true },
      _min: { timestamp: true },
      _max: { timestamp: true },
      orderBy: { _count: { id: 'desc' } }
    });

    return res.json({
      success: true,
      data: pairs.map(p => ({
        pairAddress: p.pairAddress,
        snapshotCount: p._count.id,
        firstSnapshot: p._min.timestamp,
        lastSnapshot: p._max.timestamp
      }))
    });
  } catch (error) {
    console.error('Error fetching pairs:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch pairs'
    });
  }
});

// Función para calcular APR con moving average
function calculateAPRWithMovingAverage(snapshots: any[], movingHours: number) {
  const aprData = [];
  
  for (let i = 0; i < snapshots.length; i++) {
    const currentSnapshot = snapshots[i];
    
    // Obtener snapshots dentro del rango de moving average
    const currentTime = new Date(currentSnapshot.timestamp).getTime();
    const windowStart = currentTime - (movingHours * 60 * 60 * 1000);
    
    const windowSnapshots = snapshots.filter(s => {
      const snapTime = new Date(s.timestamp).getTime();
      return snapTime >= windowStart && snapTime <= currentTime;
    });
    
    if (windowSnapshots.length > 0) {
      // Calcular promedios en la ventana
      const avgFees = windowSnapshots.reduce((sum, s) => sum + s.fees, 0) / windowSnapshots.length;
      const avgLiquidity = windowSnapshots.reduce((sum, s) => sum + s.liquidity, 0) / windowSnapshots.length;
      
      // Calcular APR: (fees / liquidity) * (365 * 24) * 100
      // Como fees es por día, multiplicamos por 365 días
      const dailyRate = avgLiquidity > 0 ? avgFees / avgLiquidity : 0;
      const apr = dailyRate * 365 * 100; // Convertir a porcentaje anual
      
      aprData.push({
        timestamp: currentSnapshot.timestamp,
        pairAddress: currentSnapshot.pairAddress,
        apr: parseFloat(apr.toFixed(4)),
        fees: avgFees,
        liquidity: avgLiquidity,
        movingAverageHours: movingHours,
        snapshotsInWindow: windowSnapshots.length
      });
    }
  }
  
  return aprData;
}

// GET /api/metrics/chart - Endpoint optimizado para charts
router.get('/chart', async (req, res) => {
  try {
    const { timeRange, from, to } = req.query;
    
    if (!timeRange || typeof timeRange !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'timeRange is required and must be a valid string'
      });
    }
    
    // Validar timeRange
    const validTimeRanges: TimeRange[] = ['7d', '1m', '3m', '6m', '1y', 'YTD', 'custom', 'All'];
    if (!validTimeRanges.includes(timeRange as TimeRange)) {
      return res.status(400).json({
        success: false,
        error: `Invalid timeRange. Must be one of: ${validTimeRanges.join(', ')}`
      });
    }
    
    // Manejar custom timeRange
    let customRange;
    if (timeRange === 'custom') {
      if (!from || !to || typeof from !== 'string' || typeof to !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'For custom timeRange, both from and to parameters are required (YYYY-MM-DD format)'
        });
      }
      
      // Validar formato de fecha
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(from) || !dateRegex.test(to)) {
        return res.status(400).json({
          success: false,
          error: 'Date format must be YYYY-MM-DD'
        });
      }
      
      customRange = { from, to };
    }
    
    const chartData = await chartService.getChartData(timeRange as TimeRange, customRange);
    return res.json(chartData);
    
  } catch (error) {
    console.error('Error generating chart data:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate chart data'
    });
  }
});

export default router;
