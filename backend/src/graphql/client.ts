import { GraphQLClient, gql } from 'graphql-request';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const client = new GraphQLClient(process.env.GRAPH_ENDPOINT!, {
  headers: { Authorization: `Bearer ${process.env.GRAPH_API_KEY!}` },
});

const PairDayData = z.object({
  date: z.number(),
  reserveUSD: z.string(),
  dailyVolumeUSD: z.string(),
});

// Esquema para toda la respuesta GraphQL
const PairDayDataResponse = z.object({
  pairDayDatas: z.array(PairDayData),
});

export type PairDayData = z.infer<typeof PairDayData>;

const GET_PAIR_DAY_DATA = gql`
  query GetPairDayData($pairAddress: String!, $timestampGt: Int!) {
    pairDayDatas(
      where: { pairAddress: $pairAddress, date_gt: $timestampGt }
      orderBy: date
      orderDirection: asc
    ) {
      date
      reserveUSD
      dailyVolumeUSD
    }
  }
`;

export async function fetchPairDayData(
  pairAddress: string,
  timestampGt: number
): Promise<PairDayData[]> {
  const raw = await client.request(GET_PAIR_DAY_DATA, { pairAddress, timestampGt });
  const validated = PairDayDataResponse.parse(raw);
  return validated.pairDayDatas;
}
