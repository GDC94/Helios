import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa.');
  } catch (err) {
    console.error('❌ Error conectando a la base de datos:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
testConnection();
