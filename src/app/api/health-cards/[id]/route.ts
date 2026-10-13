import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("card", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const card = await prisma.healthCard.findUnique({
    where: { id: Number(id) },
    include: {
      updateHistory: { orderBy: { date: "desc" } },
      lostDamaged: { orderBy: { dateReported: "desc" } },
      statusChanges: { orderBy: { effectiveDate: "desc" } },
      misuseFlags: { orderBy: { createdAt: "desc" } },
    },
  }).catch(() => null);
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const family = await prisma.family.findFirst({
    where: {
      OR: [
        { registrationNo: card.familyRegistrationNo },
        { healthCardNo: card.cardNo },
      ],
    },
    include: { members: { orderBy: { serialNo: "asc" } } },
  });

  return NextResponse.json({ ...card, family });
}
