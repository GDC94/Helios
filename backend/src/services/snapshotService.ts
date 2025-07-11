import { PrismaClient } from '@prisma/client';
import { fetchPairDayData, type PairDayData } from '../graphql/client';
import { PAIR_ADDRESSES } from '../config';

const prisma = new PrismaClient();

/**
 * Crea snapshots para un par específico desde un timestamp dado
 */
export async function createSnapshot(pairAddress: string, since: number): Promise<number> {
  try {
    const data = await fetchPairDayData(pairAddress, since);
    
    for (const item of data) {
      const volume = parseFloat(item.dailyVolumeUSD);
      
      await prisma.snapshot.create({
        data: {
          pairAddress: pairAddress,
          timestamp: new Date(item.date * 1000),
          liquidity: parseFloat(item.reserveUSD),
          volume: volume,
          fees: volume * 0.003,
        },
      });
    }
    
    console.log(`✅ Snapshots procesados para ${pairAddress}: ${data.length} registros`);
    return data.length;
  } catch (error) {
    console.error(`❌ Error snapshot ${pairAddress}:`, (error as Error).message);
    throw error;
  }
}

/**
 * Toma snapshots para todos los pares configurados
 * @param firstRun Si es la primera ejecución (toma datos de las últimas 48 horas)
 * @param interval Intervalo en minutos para calcular el timestamp desde el último snapshot
 */
export async function takeSnapshotsForAllPairs(firstRun: boolean = false, interval: number = 60): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  
  for (const address of PAIR_ADDRESSES) {
    let since = now - 48 * 3600; // Por defecto, últimas 48 horas
    
    if (!firstRun) {
      // Buscar el último snapshot para este par
      const lastSnapshot = await prisma.snapshot.findFirst({
        where: { pairAddress: address },
        orderBy: { timestamp: 'desc' },
      });
      
      if (lastSnapshot) {
        since = Math.floor(lastSnapshot.timestamp.getTime() / 1000) + interval * 60;
      }
    }
    
    // Si el timestamp calculado es mayor o igual al actual, no hay nada que procesar
    if (since >= now) {
      console.log(`⏭️  No hay nuevos datos para ${address}`);
      continue;
    }

    try {
      const data: PairDayData[] = await fetchPairDayData(address, since);
      
      for (const item of data) {
        const volume = parseFloat(item.dailyVolumeUSD);
        await prisma.snapshot.create({
          data: {
            pairAddress: address,
            timestamp: new Date(item.date * 1000),
            liquidity: parseFloat(item.reserveUSD),
            volume,            
            fees: volume * 0.003,      
          },
        });
      }
      
      console.log(`✅ Snapshots procesados para ${address}: ${data.length} registros`);
    } catch (error) {
      console.error(`❌ Error snapshot ${address}:`, (error as Error).message);
      // Continuar con el siguiente par sin detener el proceso
    }
  }
}

/**
 * Obtiene snapshots con filtros opcionales
 */
export async function getSnapshots(pairAddress?: string, limit: number = 100) {
  const whereClause: any = {};
  if (pairAddress) {
    whereClause.pairAddress = pairAddress;
  }

  return await prisma.snapshot.findMany({
    where: whereClause,
    orderBy: { timestamp: 'desc' },
    take: limit
  });
}

/**
 * Obtiene la lista de pares monitoreados con estadísticas
 */
export async function getMonitoredPairs() {
  return await prisma.snapshot.groupBy({
    by: ['pairAddress'],
    _count: { id: true },
    _min: { timestamp: true },
    _max: { timestamp: true },
    orderBy: { _count: { id: 'desc' } }
  });
}

/**
 * Obtiene estadísticas generales del servicio
 */
export async function getServiceStats() {
  const totalSnapshots = await prisma.snapshot.count();
  const uniquePairs = await prisma.snapshot.groupBy({
    by: ['pairAddress'],
    _count: { id: true }
  });
  
  const lastSnapshot = await prisma.snapshot.findFirst({
    orderBy: { timestamp: 'desc' }
  });

  return {
    totalSnapshots,
    uniquePairs: uniquePairs.length,
    lastSnapshotAt: lastSnapshot?.timestamp,
    configuredPairs: PAIR_ADDRESSES.length
  };
}

export const snapshotService = {
  createSnapshot,
  takeSnapshotsForAllPairs,
  getSnapshots,
  getMonitoredPairs,
  getServiceStats
}; 