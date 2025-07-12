import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { fetchPairDayData, type PairDayData } from '../../graphql/client';
import { PAIR_ADDRESSES } from '../../config';

const prisma = new PrismaClient();

/**
 * Crea snapshots para un par específico desde un timestamp dado
 */
export async function createSnapshot(pairAddress: string, since: number): Promise<number> {
  const data = await fetchPairDayData(pairAddress, since);
  for (const item of data) {
    const volume = parseFloat(item.dailyVolumeUSD);
    await prisma.snapshot.create({
      data: {
        pairAddress,
        timestamp: new Date(item.date * 1000),
        liquidity: parseFloat(item.reserveUSD),
        volume,
        fees: volume * 0.003,
      },
    });
  }
  console.log(`✅ Snapshots procesados para ${pairAddress}: ${data.length} registros`);
  return data.length;
}

/**
 * Procesa snapshots para todos los pares configurados
 */
export async function takeSnapshotsForAllPairs(firstRun = false, interval = 60): Promise<void> {
  const now = Math.floor(Date.now() / 1000);

  for (const address of PAIR_ADDRESSES) {
    let since = now - 48 * 3600;

    if (!firstRun) {
      const lastSnapshot = await prisma.snapshot.findFirst({
        where: { pairAddress: address },
        orderBy: { timestamp: 'desc' },
      });

      if (lastSnapshot) {
        since = Math.floor(lastSnapshot.timestamp.getTime() / 1000) + interval * 60;
      }
    }

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
    }
  }
}

/**
 * Obtiene snapshots filtrados
 */
export async function getSnapshots(pairAddress?: string, limit = 100) {
  const where: any = {};
  if (pairAddress) where.pairAddress = pairAddress;

  return await prisma.snapshot.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
}

/**
 * Lista de pares monitoreados con stats
 */
export async function getMonitoredPairs() {
  return await prisma.snapshot.groupBy({
    by: ['pairAddress'],
    _count: { id: true },
    _min: { timestamp: true },
    _max: { timestamp: true },
    orderBy: { _count: { id: 'desc' } },
  });
}

/**
 * Estadísticas globales del sistema de snapshots
 */
export async function getServiceStats() {
  const totalSnapshots = await prisma.snapshot.count();
  const uniquePairs = await prisma.snapshot.groupBy({
    by: ['pairAddress'],
    _count: { id: true },
  });

  const lastSnapshot = await prisma.snapshot.findFirst({
    orderBy: { timestamp: 'desc' },
  });

  return {
    totalSnapshots,
    uniquePairs: uniquePairs.length,
    lastSnapshotAt: lastSnapshot?.timestamp,
    configuredPairs: PAIR_ADDRESSES.length,
  };
}

/**
 * Ejecuta el snapshot job programado usando node-cron
 */
export const startSnapshotJob = () => {
  const interval = parseInt(process.env.SNAPSHOT_INTERVAL || '60', 10);

  console.log(`⏳ Iniciando snapshot job cada ${interval} minutos...`);
  executeSnapshotJob(true, interval);

  cron.schedule(`*/${interval} * * * *`, () => {
    executeSnapshotJob(false, interval);
  });

  console.log(`🕒 Snapshot job programado exitosamente`);
};

const executeSnapshotJob = async (firstRun: boolean, interval: number) => {
  try {
    console.log(`🔄 Ejecutando snapshot job... (firstRun: ${firstRun})`);
    await takeSnapshotsForAllPairs(firstRun, interval);
    const stats = await getServiceStats();
    console.log(`📊 Estadísticas: ${stats.totalSnapshots} snapshots totales, ${stats.uniquePairs} pares únicos`);
  } catch (error) {
    console.error(`❌ Error en snapshot job:`, (error as Error).message);
  }
};

/**
 * API agrupada para usar como servicio
 */
export const snapshotService = {
  createSnapshot,
  takeSnapshotsForAllPairs,
  getSnapshots,
  getMonitoredPairs,
  getServiceStats,
  startSnapshotJob,
};
