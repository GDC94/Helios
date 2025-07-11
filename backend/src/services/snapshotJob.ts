import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { takeSnapshotsForAllPairs, getServiceStats } from './snapshotService';

/**
 * Inicia el trabajo programado de snapshots
 * @param prisma Cliente de Prisma (se mantiene para compatibilidad)
 */
export const startSnapshotJob = (prisma: PrismaClient) => {
  const interval = parseInt(process.env.SNAPSHOT_INTERVAL || '60', 10);
  
  console.log(`🕐 Iniciando snapshot job con intervalo de ${interval} minutos...`);
  
  // Ejecutar inmediatamente al iniciar (primera ejecución)
  executeSnapshotJob(true, interval);
  
  // Programar ejecución periódica
  cron.schedule(`*/${interval} * * * *`, () => {
    executeSnapshotJob(false, interval);
  });
  
  console.log(`✅ Snapshot job programado exitosamente`);
};

/**
 * Ejecuta el trabajo de toma de snapshots
 * @param firstRun Si es la primera ejecución
 * @param interval Intervalo en minutos
 */
const executeSnapshotJob = async (firstRun: boolean, interval: number) => {
  try {
    console.log(`🔄 Ejecutando snapshot job... (firstRun: ${firstRun})`);
    
    await takeSnapshotsForAllPairs(firstRun, interval);
    
    // Mostrar estadísticas después de cada ejecución
    const stats = await getServiceStats();
    console.log(`📊 Estadísticas: ${stats.totalSnapshots} snapshots totales, ${stats.uniquePairs} pares únicos`);
    
  } catch (error) {
    console.error(`❌ Error en snapshot job:`, (error as Error).message);
  }
};

export default startSnapshotJob;