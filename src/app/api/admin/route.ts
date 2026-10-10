import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { AuthError, requirePermission } from "@/lib/permissions";

const settingKeys = ["institutionAddress", "publicPhone", "publicEmail"] as const;
const updateSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("setting"), key: z.enum(settingKeys), value: z.string().max(300) }),
  z.object({ type: z.literal("hospital"), id: z.number().int().positive(), name: z.string().trim().min(1).max(200), healthDeskLocation: z.string().max(300).optional(), healthDeskContact: z.string().max(120).optional(), orientationCompleted: z.boolean() }),
]);

export async function GET(req: NextRequest) {
  try { await requirePermission("user", "manage", req); }
  catch (error) { if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status }); throw error; }
  const [hospitals, settings] = await Promise.all([
    prisma.hospital.findMany({ orderBy: { id: "asc" }, select: { id: true, code: true, name: true, healthDeskLocation: true, healthDeskContact: true, orientationCompleted: true } }),
    prisma.setting.findMany({ where: { key: { in: [...settingKeys] } } }),
  ]);
  return NextResponse.json({ hospitals, settings: Object.fromEntries(settings.map((setting) => [setting.key, setting.value])) });
}

export async function PATCH(req: NextRequest) {
  let session;
  try { session = await requirePermission("user", "manage", req); }
  catch (error) { if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status }); throw error; }
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation failed" }, { status: 400 });
  const value = parsed.data;
  let entity: string;
  let id: string;
  if (value.type === "setting") {
    await prisma.setting.upsert({ where: { key: value.key }, create: { key: value.key, value: value.value, updatedBy: session.email }, update: { value: value.value, updatedBy: session.email } });
    entity = "setting"; id = value.key;
  } else {
    await prisma.hospital.update({ where: { id: value.id }, data: { name: value.name, healthDeskLocation: value.healthDeskLocation || null, healthDeskContact: value.healthDeskContact || null, orientationCompleted: value.orientationCompleted } });
    entity = "hospital"; id = String(value.id);
  }
  await prisma.auditLog.create({ data: { who: session.email ?? String(session.id), role: session.role, action: "admin_update", entity, entityId: id, hospitalId: session.hospitalId } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
