import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
try {
  const users = await p.user.findMany({ select: { id: true, email: true, isActive: true, role: true, name: true } });
  console.log(JSON.stringify(users, null, 2));
} finally {
  await p.$disconnect();
}