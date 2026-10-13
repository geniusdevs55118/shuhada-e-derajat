import { afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

afterAll(async () => {
  const prisma = new PrismaClient();
  await prisma.$disconnect().catch(() => {});
});
