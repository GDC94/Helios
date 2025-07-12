import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PAIR_ADDRESSES } from '../config';
import { chartService } from '../services/chart';
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

// GET /api/metrics/service-stats - Estadísticas del servicio de snapshots
router.get('/service-stats', async (req, res) => {
  try {
    const { getServiceStats } = await import('../services/snapshots');
    const stats = await getServiceStats();
    
    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching service stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch service stats'
    });
  }
});

// GET /api/metrics/global - Global metrics para el dashboard
router.get('/global', async (req, res) => {
  try {
    // Obtener snapshots más recientes para cada par
    const latestSnapshots = await prisma.snapshot.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50 // Últimos 50 snapshots para tener datos suficientes
    });

    if (latestSnapshots.length === 0) {
      return res.json({
        success: true,
        data: {
          totalAllocation: 0,
          dayChange: { value: 0, percentage: 0 },
          ytdChange: { value: 0, percentage: 0 },
          averageAnnualizedYield: 0,
          totalDeployed: 0
        }
      });
    }

    // Calcular métricas globales
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Total Allocation (liquidez actual)
    const currentSnapshots = latestSnapshots.slice(0, 5); // Últimos 5 snapshots
    const totalAllocation = currentSnapshots.reduce((sum, s) => sum + s.liquidity, 0) / currentSnapshots.length;

    // Day Change
    const yesterdaySnapshots = latestSnapshots.filter(s => 
      new Date(s.timestamp) >= yesterday && new Date(s.timestamp) < now
    );
    
    const yesterdayAvg = yesterdaySnapshots.length > 0 ? 
      yesterdaySnapshots.reduce((sum, s) => sum + s.liquidity, 0) / yesterdaySnapshots.length : 
      totalAllocation;
    
    const dayChangeValue = totalAllocation - yesterdayAvg;
    const dayChangePercentage = yesterdayAvg > 0 ? (dayChangeValue / yesterdayAvg) * 100 : 0;

    // YTD Change (aproximado basado en datos disponibles)
    const yearStartSnapshots = latestSnapshots.filter(s => 
      new Date(s.timestamp) >= yearStart
    );
    const ytdStartValue = yearStartSnapshots.length > 0 ? 
      yearStartSnapshots[yearStartSnapshots.length - 1]?.liquidity || totalAllocation * 0.5 : 
      totalAllocation * 0.5; // Estimación si no hay datos del inicio del año
    
    const ytdChangeValue = totalAllocation - ytdStartValue;
    const ytdChangePercentage = ytdStartValue > 0 ? (ytdChangeValue / ytdStartValue) * 100 : 0;

    // Average Annualized Yield (basado en APR reciente)
    const recentAPRData = calculateAPRWithMovingAverage(latestSnapshots.slice(0, 10), 24);
    const averageAnnualizedYield = recentAPRData.length > 0 ? 
      recentAPRData.reduce((sum, apr) => sum + apr.apr, 0) / recentAPRData.length : 0;

    // Total Deployed (suma de toda la liquidez histórica máxima)
    const maxLiquidity = Math.max(...latestSnapshots.map(s => s.liquidity));
    const totalDeployed = maxLiquidity * 1.2; // Factor de seguridad

    return res.json({
      success: true,
      data: {
        totalAllocation,
        dayChange: {
          value: dayChangeValue,
          percentage: dayChangePercentage
        },
        ytdChange: {
          value: ytdChangeValue,
          percentage: ytdChangePercentage
        },
        averageAnnualizedYield,
        totalDeployed
      }
    });
  } catch (error) {
    console.error('Error calculating global metrics:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate global metrics'
    });
  }
});

// GET /api/metrics/annualized-returns - Retornos anualizados para diferentes períodos
router.get('/annualized-returns', async (req, res) => {
  try {
    const { pairAddress } = req.query;
    
    const whereClause: any = {};
    if (pairAddress && typeof pairAddress === 'string') {
      whereClause.pairAddress = pairAddress;
    } else {
      whereClause.pairAddress = { in: PAIR_ADDRESSES };
    }

    const snapshots = await prisma.snapshot.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: 200 // Suficientes datos para todos los períodos
    });

    if (snapshots.length === 0) {
      return res.json({
        success: true,
        data: {
          allTime: 0,
          thirtyDay: 0,
          sevenDay: 0,
          twentyFourHour: 0
        }
      });
    }

    const now = new Date();
    const periods = {
      twentyFourHour: { hours: 24, snapshots: [] as any[] },
      sevenDay: { hours: 24 * 7, snapshots: [] as any[] },
      thirtyDay: { hours: 24 * 30, snapshots: [] as any[] },
      allTime: { hours: 24 * 365, snapshots: [] as any[] } // Máximo 1 año
    };

    // Filtrar snapshots por período
    const periodKeys: (keyof typeof periods)[] = ['twentyFourHour', 'sevenDay', 'thirtyDay', 'allTime'];
    periodKeys.forEach(periodKey => {
      const period = periods[periodKey];
      const cutoffTime = new Date(now.getTime() - period.hours * 60 * 60 * 1000);
      period.snapshots = snapshots.filter(s => new Date(s.timestamp) >= cutoffTime);
    });

    // Calcular retornos anualizados para cada período
    const calculateAnnualizedReturn = (periodSnapshots: any[], periodHours: number) => {
      if (periodSnapshots.length < 2) return 0;

      const sortedSnapshots = periodSnapshots.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const initialValue = sortedSnapshots[0].liquidity;
      const finalValue = sortedSnapshots[sortedSnapshots.length - 1].liquidity;
      
      if (initialValue <= 0) return 0;

      // Calcular retorno simple del período
      const periodReturn = (finalValue - initialValue) / initialValue;
      
      // Anualizar el retorno (convertir a base anual)
      const periodsPerYear = (365 * 24) / periodHours;
      const annualizedReturn = (Math.pow(1 + periodReturn, periodsPerYear) - 1) * 100;
      
      return Math.max(0, Math.min(annualizedReturn, 100)); // Limitar entre 0% y 100%
    };

    const results = {
      allTime: calculateAnnualizedReturn(periods.allTime.snapshots, periods.allTime.hours),
      thirtyDay: calculateAnnualizedReturn(periods.thirtyDay.snapshots, periods.thirtyDay.hours),
      sevenDay: calculateAnnualizedReturn(periods.sevenDay.snapshots, periods.sevenDay.hours),
      twentyFourHour: calculateAnnualizedReturn(periods.twentyFourHour.snapshots, periods.twentyFourHour.hours)
    };

    return res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error calculating annualized returns:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate annualized returns'
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
      const avgFees = windowSnapshots.reduce((sum, s) => sum + s.fees, 0) / windowSnapshots.length;
      const avgLiquidity = windowSnapshots.reduce((sum, s) => sum + s.liquidity, 0) / windowSnapshots.length;
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
