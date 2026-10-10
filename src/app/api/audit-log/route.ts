import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";
import { maskCnic } from "@/lib/cnic";

export async function GET(req: NextRequest) {
  try {
    await requirePermission("audit_log", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const sp = new URL(req.url).searchParams;
  const who = sp.get("who")?.trim();
  const action = sp.get("action")?.trim();
  const entity = sp.get("entity")?.trim();
  const from = sp.get("from");
  const to = sp.get("to");
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const pageSize = 25;

  const where: Record<string, unknown> = {};
  if (who) where.who = { contains: who };
  if (action) where.action = { contains: action };
  if (entity) where.entity = entity;
  if (from || to) where.createdAt = { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) };

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
  ]);

  return NextResponse.json({
    total,
    page,
    pageSize,
    data: logs.map((l) => ({ ...l, whoMasked: l.who.includes("@") ? l.who : maskCnic(l.who) })),
  });
}
