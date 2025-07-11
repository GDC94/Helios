import { PrismaClient } from '@prisma/client';
import { TimeRange, ChartResponse, ChartDataPoint, CustomDateRange } from '../types/chart';
import { PAIR_ADDRESSES } from '../config';

const prisma = new PrismaClient();

/**
 * Función para calcular APR con moving average
 * Reutilizada de routes/metrics.ts
 */
function calculateAPRWithMovingAverage(snapshots: any[], movingHours: number): any[] {
  const aprData = [];
  
  for (let i = 0; i < snapshots.length; i++) {
    const currentSnapshot = snapshots[i];
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
      const apr = dailyRate * 365 * 100;
      
      aprData.push({
        timestamp: currentSnapshot.timestamp,
        apr: parseFloat(apr.toFixed(4)),
        liquidity: avgLiquidity
      });
    }
  }
  
  return aprData;
}

/**
 * Estrategias para cada timeRange
 */
class SevenDaysStrategy {
  getMovingAverage(): number { return 1; }
  
  getDateRange(): { from: Date; to: Date } {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { from: sevenDaysAgo, to: now };
  }
  
  async processData(): Promise<ChartDataPoint[]> {
    const { from, to } = this.getDateRange();
    const results: ChartDataPoint[] = [];
    
    // Obtener snapshots de los últimos 7 días
    const snapshots = await prisma.snapshot.findMany({
      where: {
        pairAddress: { in: [...PAIR_ADDRESSES] },
        timestamp: { gte: from, lte: to }
      },
      orderBy: { timestamp: 'asc' }
    });

    // Agrupar snapshots por día
    const dailyData = new Map<string, any[]>();
    
    snapshots.forEach(snapshot => {
      const day = snapshot.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!dailyData.has(day ?? '')) {
        dailyData.set(day ?? '', []);
      }
      dailyData.get(day ?? '')!.push(snapshot);
    });

    // Generar exactamente 7 días (desde from hasta 7 días después)
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
      const dayString = currentDate.toISOString().split('T')[0]!;
      
      // Usar datos del día si existen, sino usar datos promedio disponibles
      const daySnapshots = dailyData.get(dayString) || [];
      
      let avgLiquidity = 0;
      let avgFees = 0;
      let apr = 0;
      
      if (daySnapshots.length > 0) {
        // Usar datos reales del día
        avgLiquidity = daySnapshots.reduce((sum, s) => sum + s.liquidity, 0) / daySnapshots.length;
        avgFees = daySnapshots.reduce((sum, s) => sum + s.fees, 0) / daySnapshots.length;
      } else if (snapshots.length > 0) {
        // Usar promedio de todos los snapshots disponibles como fallback
        avgLiquidity = snapshots.reduce((sum, s) => sum + s.liquidity, 0) / snapshots.length;
        avgFees = snapshots.reduce((sum, s) => sum + s.fees, 0) / snapshots.length;
      }
      
      // Calcular APR
      const dailyRate = avgLiquidity > 0 ? avgFees / avgLiquidity : 0;
      apr = dailyRate * 365 * 100;
      
      // Crear 2 puntos por día: 00:00 (medianoche) y 12:00 (mediodía)
      const midnightTime = new Date(dayString + 'T00:00:00.000Z');
      const noonTime = new Date(dayString + 'T12:00:00.000Z');
      
      // Agregar punto de medianoche (inicio del día)
      results.push({
        value: Math.round(avgLiquidity / 1000000),
        apr: Number(apr.toFixed(1)),
        timestamp: midnightTime.toISOString(),
        displayType: 'date' as const
      });
      
      // Agregar punto de mediodía
      results.push({
        value: Math.round(avgLiquidity / 1000000),
        apr: Number(apr.toFixed(1)),
        timestamp: noonTime.toISOString(),
        displayType: 'hour' as const
      });
    }
    
    return results;
  }
}

class OneMonthStrategy {
  getMovingAverage(): number { return 12; }
  
  getDateRange(): { from: Date; to: Date } {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from: thirtyDaysAgo, to: now };
  }
  
  async processData(): Promise<ChartDataPoint[]> {
    const { from, to } = this.getDateRange();
    const results: ChartDataPoint[] = [];
    
    for (let i = 0; i < 30; i++) {
      const targetDate = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
      const noonTime = new Date(targetDate.setHours(12, 0, 0, 0));
      
      const snapshots = await this.getSnapshotsForDay(noonTime);
      if (snapshots.length > 0) {
        const aprData = calculateAPRWithMovingAverage(snapshots, this.getMovingAverage());
        if (aprData.length > 0) {
          const avgLiquidity = aprData.reduce((sum, item) => sum + item.liquidity, 0) / aprData.length;
          const avgAPR = aprData.reduce((sum, item) => sum + item.apr, 0) / aprData.length;
          
          results.push({
            value: Math.round(avgLiquidity / 1000000),
            apr: Number(avgAPR.toFixed(1)),
            timestamp: noonTime.toISOString()
          });
        }
      }
    }
    
    return results;
  }
  
  private async getSnapshotsForDay(targetDay: Date) {
    const dayStart = new Date(targetDay.setHours(0, 0, 0, 0));
    const dayEnd = new Date(targetDay.setHours(23, 59, 59, 999));
    
    return await prisma.snapshot.findMany({
      where: {
        pairAddress: { in: [...PAIR_ADDRESSES] },
        timestamp: { gte: dayStart, lte: dayEnd }
      },
      orderBy: { timestamp: 'asc' }
    });
  }
}

class MonthlyStrategy {
  constructor(private months: number) {}
  
  getMovingAverage(): number { return 24; }
  
  getDateRange(): { from: Date; to: Date } {
    const now = new Date();
    const monthsAgo = new Date(now.getFullYear(), now.getMonth() - this.months, 1);
    return { from: monthsAgo, to: now };
  }
  
  async processData(): Promise<ChartDataPoint[]> {
    const { from } = this.getDateRange();
    const results: ChartDataPoint[] = [];
    
    for (let i = 0; i < this.months; i++) {
      const monthStart = new Date(from.getFullYear(), from.getMonth() + i, 1);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      const snapshots = await this.getSnapshotsForMonth(monthStart, monthEnd);
      if (snapshots.length > 0) {
        const aprData = calculateAPRWithMovingAverage(snapshots, this.getMovingAverage());
        if (aprData.length > 0) {
          const avgLiquidity = aprData.reduce((sum, item) => sum + item.liquidity, 0) / aprData.length;
          const avgAPR = aprData.reduce((sum, item) => sum + item.apr, 0) / aprData.length;
          
          const midMonth = new Date(monthStart.getFullYear(), monthStart.getMonth(), 15);
          results.push({
            value: Math.round(avgLiquidity / 1000000),
            apr: Number(avgAPR.toFixed(1)),
            timestamp: midMonth.toISOString()
          });
        }
      }
    }
    
    return results;
  }
  
  private async getSnapshotsForMonth(monthStart: Date, monthEnd: Date) {
    return await prisma.snapshot.findMany({
      where: {
        pairAddress: { in: [...PAIR_ADDRESSES] },
        timestamp: { gte: monthStart, lte: monthEnd }
      },
      orderBy: { timestamp: 'asc' }
    });
  }
}

class YTDStrategy {
  getMovingAverage(): number { return 24; }
  
  getDateRange(): { from: Date; to: Date } {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    return { from: yearStart, to: now };
  }
  
  async processData(): Promise<ChartDataPoint[]> {
    const { from, to } = this.getDateRange();
    const results: ChartDataPoint[] = [];
    const currentMonth = to.getMonth(); // 0-11 (enero = 0, julio = 6)
    
    // Generar datos para cada mes desde enero hasta el mes actual
    for (let monthIndex = 0; monthIndex <= currentMonth; monthIndex++) {
      const monthStart = new Date(from.getFullYear(), monthIndex, 1);
      const monthEnd = new Date(monthStart.getFullYear(), monthIndex + 1, 0);
      
      const snapshots = await this.getSnapshotsForMonth(monthStart, monthEnd);
      
      // Usar datos del mes si existen, sino usar datos promedio como fallback
      let avgLiquidity = 0;
      let avgAPR = 0;
      
      if (snapshots.length > 0) {
        const aprData = calculateAPRWithMovingAverage(snapshots, this.getMovingAverage());
        if (aprData.length > 0) {
          avgLiquidity = aprData.reduce((sum, item) => sum + item.liquidity, 0) / aprData.length;
          avgAPR = aprData.reduce((sum, item) => sum + item.apr, 0) / aprData.length;
        }
      } else {
        // Usar valores por defecto si no hay datos para el mes
        avgLiquidity = 24_000_000; // 24M como valor por defecto
        avgAPR = 8.5; // 8.5% como APR por defecto
      }
      
      // Usar el día 15 del mes como timestamp (mitad del mes)
      const midMonth = new Date(monthStart.getFullYear(), monthIndex, 15, 12, 0, 0);
      
      results.push({
        value: Math.round(avgLiquidity / 1000000),
        apr: Number(avgAPR.toFixed(1)),
        timestamp: midMonth.toISOString()
      });
    }
    
    return results;
  }
  
  private async getSnapshotsForMonth(monthStart: Date, monthEnd: Date) {
    return await prisma.snapshot.findMany({
      where: {
        pairAddress: { in: [...PAIR_ADDRESSES] },
        timestamp: { gte: monthStart, lte: monthEnd }
      },
      orderBy: { timestamp: 'asc' }
    });
  }
}

function calculateYAxisMax(data: ChartDataPoint[]): number {
  if (data.length === 0) return 40; // Valor por defecto si no hay datos
  
  const maxValue = Math.max(...data.map(point => point.value ?? 0));
  
  // Agregar buffer del 15% y redondear hacia arriba al siguiente múltiplo de 5
  const bufferedMax = maxValue * 1.15;
  const roundedMax = Math.ceil(bufferedMax / 5) * 5;

  return Math.max(roundedMax, 40);
}

export class ChartService {
  private strategies: Record<TimeRange, () => Promise<ChartDataPoint[]>> = {
    '7d': () => new SevenDaysStrategy().processData(),
    '1m': () => new OneMonthStrategy().processData(),
    '3m': () => new MonthlyStrategy(3).processData(),
    '6m': () => new MonthlyStrategy(6).processData(),
    '1y': () => new MonthlyStrategy(12).processData(),
    'YTD': () => new YTDStrategy().processData(),
    'custom': () => Promise.resolve([]), // Se maneja por separado
    'All': () => new SevenDaysStrategy().processData() // Usar la misma lógica que 7d
  };
  
  async getChartData(timeRange: TimeRange, customRange?: CustomDateRange): Promise<ChartResponse> {
    try {
      let data: ChartDataPoint[];
      let config: ChartResponse['config'];
      
      if (timeRange === 'custom' && customRange) {
        data = await this.getCustomData(customRange);
        config = {
          timeRange,
          movingAverage: this.getCustomMovingAverage(customRange),
          totalDataPoints: data.length,
          yAxisMax: calculateYAxisMax(data),
          from: customRange.from,
          to: customRange.to
        };
      } else {
        data = await this.strategies[timeRange]();
        config = {
          timeRange,
          movingAverage: this.getMovingAverageForTimeRange(timeRange),
          totalDataPoints: data.length,
          yAxisMax: calculateYAxisMax(data)
        };
      }
      
      return {
        success: true,
        data,
        config
      };
    } catch (error) {
      throw new Error(`Failed to get chart data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private async getCustomData(customRange: CustomDateRange): Promise<ChartDataPoint[]> {
    const from = new Date(customRange.from);
    const to = new Date(customRange.to);
    const diffDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    
    // Usar formato diario para períodos de 30 días o menos
    if (diffDays <= 30) {
      return await this.getCustomDailyData(from, to, diffDays);
    } else {
      return await this.getCustomMonthlyData(from, to);
    }
  }
  
  private async getCustomDailyData(from: Date, to: Date, diffDays: number): Promise<ChartDataPoint[]> {
    const movingAverage = diffDays <= 15 ? 1 : 12;
    const results: ChartDataPoint[] = [];
    
    const allSnapshots = await prisma.snapshot.findMany({
      where: {
        pairAddress: { in: [...PAIR_ADDRESSES] },
        timestamp: { gte: from, lte: to }
      },
      orderBy: { timestamp: 'asc' }
    });
    
    const dailyData = new Map<string, any[]>();
    allSnapshots.forEach(snapshot => {
      const day = snapshot.timestamp.toISOString().split('T')[0]!; // YYYY-MM-DD
      if (!dailyData.has(day)) {
        dailyData.set(day, []);
      }
      dailyData.get(day)!.push(snapshot);
    });

    for (let i = 0; i <= diffDays; i++) {
      const currentDate = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
      const dayString = currentDate.toISOString().split('T')[0]!;
      
      const daySnapshots = dailyData.get(dayString) || [];
      
      let avgLiquidity = 0;
      let avgAPR = 0;
      
      if (daySnapshots.length > 0) {
        const aprData = calculateAPRWithMovingAverage(daySnapshots, movingAverage);
        if (aprData.length > 0) {
          avgLiquidity = aprData.reduce((sum, item) => sum + item.liquidity, 0) / aprData.length;
          avgAPR = aprData.reduce((sum, item) => sum + item.apr, 0) / aprData.length;
        }
      } else {
        avgLiquidity = 24_000_000;
        avgAPR = 8.5;
      }
      
      // Usar mediodía como timestamp
      const noonTime = new Date(dayString + 'T12:00:00.000Z');
      
      results.push({
        value: Math.round(avgLiquidity / 1000000),
        apr: Number(avgAPR.toFixed(1)),
        timestamp: noonTime.toISOString()
      });
    }
    
    return results;
  }
  
  private async getCustomMonthlyData(from: Date, to: Date): Promise<ChartDataPoint[]> {
    const results: ChartDataPoint[] = [];
    
    const allSnapshots = await prisma.snapshot.findMany({
      where: {
        pairAddress: { in: [...PAIR_ADDRESSES] },
        timestamp: { gte: from, lte: to }
      },
      orderBy: { timestamp: 'asc' }
    });
    
    // Agrupar snapshots por mes
    const monthlyData = new Map<string, any[]>();
    allSnapshots.forEach(snapshot => {
      const date = new Date(snapshot.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, []);
      }
      monthlyData.get(monthKey)!.push(snapshot);
    });
    
    let currentMonth = new Date(from.getFullYear(), from.getMonth(), 1);
    const endMonth = new Date(to.getFullYear(), to.getMonth(), 1);
    
    while (currentMonth <= endMonth) {
      const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
      const monthSnapshots = monthlyData.get(monthKey) || [];
      
      let avgLiquidity = 0;
      let avgAPR = 0;
      
      if (monthSnapshots.length > 0) {
        const aprData = calculateAPRWithMovingAverage(monthSnapshots, 24);
        if (aprData.length > 0) {
          avgLiquidity = aprData.reduce((sum, item) => sum + item.liquidity, 0) / aprData.length;
          avgAPR = aprData.reduce((sum, item) => sum + item.apr, 0) / aprData.length;
        }
      } else {
        // Usar valores por defecto si no hay datos para el mes
        avgLiquidity = 24_000_000; // 24M como valor por defecto
        avgAPR = 8.5; // 8.5% como APR por defecto
      }
    
      const midMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15, 12, 0, 0);
      
      results.push({
        value: Math.round(avgLiquidity / 1000000),
        apr: Number(avgAPR.toFixed(1)),
        timestamp: midMonth.toISOString()
      });
      
      // Avanzar al siguiente mes
      currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    }
    
    return results;
  }
  
  private getMovingAverageForTimeRange(timeRange: TimeRange): number {
    const mapping: Record<Exclude<TimeRange, 'custom'>, number> = {
      '7d': 1,
      '1m': 12,
      '3m': 24,
      '6m': 24,
      '1y': 24,
      'YTD': 24,
      'All': 1 // Usar el mismo promedio móvil que 7d
    };
    return mapping[timeRange as Exclude<TimeRange, 'custom'>];
  }
  
  private getCustomMovingAverage(customRange: CustomDateRange): number {
    const from = new Date(customRange.from);
    const to = new Date(customRange.to);
    const diffDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 15) return 1;
    if (diffDays <= 45) return 12;
    return 24;
  }
}

export const chartService = new ChartService(); 