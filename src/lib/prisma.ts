import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Create a native PostgreSQL connection pool using your Supabase URL
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// 2. Wrap that pool in Prisma's official adapter
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);

// 3. Standard Singleton Setup
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 4. Inject the adapter into the PrismaClient constructor
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // <--- This fulfills the strict V7 Engine requirement!
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}