import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AuthError, requireUser } from "@/lib/permissions";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const notifications = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 30 });
    return NextResponse.json({ notifications, unread: notifications.filter((item) => !item.readAt).length });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    throw error;
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const parsed = z.object({ id: z.number().int().positive().optional(), all: z.boolean().optional() }).safeParse(await req.json().catch(() => null));
    if (!parsed.success || (!parsed.data.id && !parsed.data.all)) return NextResponse.json({ error: "Notification id or all=true is required" }, { status: 400 });
    await prisma.notification.updateMany({ where: { userId: user.id, readAt: null, ...(parsed.data.id ? { id: parsed.data.id } : {}) }, data: { readAt: new Date() } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    throw error;
  }
}
