import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [settings, hospitals] = await Promise.all([
    prisma.setting.findMany({ where: { key: { in: ["institutionAddress", "publicPhone", "publicEmail"] } } }).catch(() => []),
    prisma.hospital.findMany({ orderBy: { id: "asc" }, select: { code: true, name: true, healthDeskLocation: true, healthDeskContact: true } }).catch(() => []),
  ]);
  return NextResponse.json({ settings: Object.fromEntries(settings.map((item) => [item.key, item.value])), hospitals });
}
