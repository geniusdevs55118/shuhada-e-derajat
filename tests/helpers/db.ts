import { PrismaClient } from "@prisma/client";

const globalPrisma = new PrismaClient();

export async function canConnect(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await Promise.race([
      globalPrisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
    ]);
    return true;
  } catch {
    return false;
  }
}

export { globalPrisma };
