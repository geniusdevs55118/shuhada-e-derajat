import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, AuthError, can } from "@/lib/permissions";
import { PERIODIC_REVIEW_FLAGS } from "@/lib/card-schemas";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireUser(req);
    if (!can(session, "card", "edit")) throw new AuthError(403, "Forbidden");
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const checked = Array.isArray(body?.confirmations) ? body.confirmations.filter((c: unknown) => typeof c === "string" && (PERIODIC_REVIEW_FLAGS as readonly string[]).includes(c as string)) : [];
  const nextReviewDate = body?.nextReviewDate ? new Date(body.nextReviewDate) : null;
  const reviewedBy = typeof body?.reviewedBy === "string" ? body.reviewedBy.trim() : "";
  const designation = typeof body?.designation === "string" ? body.designation.trim() : "";
  if (!nextReviewDate || !reviewedBy || !designation) {
    return NextResponse.json({ error: "nextReviewDate, reviewedBy and designation are required" }, { status: 400 });
  }

  const card = await prisma.healthCard.findUnique({ where: { id: Number(id) } });
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.healthCard.update({
    where: { id: card.id },
    data: {
      reviewFlags: checked,
      nextReviewDate,
      reviewedBy,
      reviewDesignation: designation,
      reviewRevalidationDate: new Date(),
    },
  });
  await prisma.cardUpdateHistory.create({
    data: { healthCardId: card.id, date: new Date(), natureOfUpdate: "Periodic review recorded", reason: checked.join(", "), verifiedBy: session.email ?? String(session.id) },
  });
  await prisma.auditLog.create({ data: { who: session.email ?? String(session.id), role: session.role, action: "periodic_review", entity: "card", entityId: String(card.id), hospitalId: session.hospitalId } });
  return NextResponse.json(updated);
}
