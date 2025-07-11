import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { fetchPairDayData, PairDayData } from '../graphql/client';
import { PAIR_ADDRESSES } from '../config';

export const startSnapshotJob = (prisma: PrismaClient) => {
  const interval = parseInt(process.env.SNAPSHOT_INTERVAL || '60', 10);
  takeSnapshots(true, prisma, interval);
  cron.schedule(`*/${interval} * * * *`, () => takeSnapshots(false, prisma, interval));
}

const takeSnapshots = async (firstRun: boolean, prisma: PrismaClient, interval: number) => {
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
    if (since >= now) continue;

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
      console.log(`✅ Snapshots procesados para ${address}`);
    } catch (error) {
      console.error(`❌ Error snapshot ${address}:`, (error as Error).message);
    }
  }
}
 
export default startSnapshotJob;