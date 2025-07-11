import { PrismaClient } from '@prisma/client';
import { fetchPairDayData } from '../graphql/client';

const prisma = new PrismaClient();

export class SnapshotService {
  
  async createSnapshot(pairAddress: string, since: number) {
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
      
      console.log(`✅ Snapshots procesados para ${pairAddress}`);
      return data.length;
    } catch (error) {
      console.error(`Error snapshot ${pairAddress}:`, (error as Error).message);
      throw error;
    }
  }

  async getSnapshots(pairAddress?: string) {
    const whereClause: any = {};
    if (pairAddress) {
      whereClause.pairAddress = pairAddress;
    }

    return await prisma.snapshot.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: 100
    });
  }

  async getMonitoredPairs() {
    return await prisma.snapshot.groupBy({
      by: ['pairAddress'],
      _count: { id: true }
    });
  }
}

export const snapshotService = new SnapshotService(); 