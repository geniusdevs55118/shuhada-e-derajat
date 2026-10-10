import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, AuthError, can } from "@/lib/permissions";
import { getNextCardNo, generateUnguessableQrId } from "@/lib/card-generation";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireUser(req);
    const canPropose = can(session, "card", "propose_lost_replacement");
    const canAuthorize = can(session, "card", "authorize_lost_replacement");
    if (!canPropose && !canAuthorize) throw new AuthError(403, "Forbidden");
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const dateReported = body?.dateReported ? new Date(body.dateReported) : new Date();
  const reason = typeof body?.reason === "string" ? body.reason : "";
  if (!reason) return NextResponse.json({ error: "reason is required" }, { status: 400 });
  const issueReplacement = body?.issueReplacement === true;

  const card = await prisma.healthCard.findUnique({ where: { id: Number(id) } });
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const canAuthorize = can(session, "card", "authorize_lost_replacement");
  if (issueReplacement && !canAuthorize) {
    return NextResponse.json({ error: "Only a director can approve a replacement card" }, { status: 403 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const report = await tx.lostDamagedCard.create({
      data: {
        healthCardId: card.id,
        dateReported,
        previousCardNo: card.cardNo,
        reasonRemarks: reason,
        authorisedBy: session.email ?? String(session.id),
      },
    });

    let replacement = null;
    if (issueReplacement) {
      const newNo = await getNextCardNo(tx);
      const newQr = generateUnguessableQrId();
      replacement = await tx.healthCard.create({
        data: {
          familyRegistrationNo: card.familyRegistrationNo,
          cardNo: newNo,
          qrDigitalVerificationId: newQr,
          dateOfRegistration: card.dateOfRegistration,
          dateOfCardIssue: new Date(),
          status: card.status === "CLOSED" || card.status === "TEMPORARILY_SUSPENDED" ? card.status : "UNDER_VERIFICATION",
          specialFlags: card.specialFlags ?? [],
          controlFlags: card.controlFlags ?? [],
          issuedBy: session.email ?? String(session.id),
          issuedByDesignation: session.role,
          accessDHQ: card.accessDHQ,
          accessMMMTH: card.accessMMMTH,
          accessWC: card.accessWC,
          reviewFlags: card.reviewFlags ?? [],
          authorisedOfficer: card.authorisedOfficer,
          authorisedDesignation: card.authorisedDesignation,
          authorisedSignature: card.authorisedSignature,
          authorisedDate: card.authorisedDate,
        },
      });
      await tx.healthCard.update({ where: { id: card.id }, data: { status: "CLOSED" } });
      await tx.lostDamagedCard.update({
        where: { id: report.id },
        data: { replacementCardNo: newNo, replacementDate: new Date() },
      });
      await tx.cardUpdateHistory.create({
        data: { healthCardId: card.id, date: new Date(), natureOfUpdate: "Replaced due to lost/damaged", reason, verifiedBy: session.email ?? String(session.id) },
      });
      const family = await tx.family.findFirst({ where: { registrationNo: card.familyRegistrationNo } });
      if (family) {
        await tx.family.update({ where: { id: family.id }, data: { healthCardNo: newNo, qrDigitalId: newQr, cardQrVerificationId: newQr } });
      }
    }

    await tx.auditLog.create({ data: { who: session.email ?? String(session.id), role: session.role, action: issueReplacement ? "replacement_issued" : "lost_damaged_reported", entity: "card", entityId: String(card.id), hospitalId: session.hospitalId } });
    return { report, replacement };
  });

  return NextResponse.json(result, { status: 201 });
}
