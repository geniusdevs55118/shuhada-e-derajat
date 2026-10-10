import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";
import { authorizationSchema } from "@/lib/family-schemas";
import { AuthorizationDecision } from "@prisma/client";

const AUTHORIZATION_DECISION_MAP: Record<string, AuthorizationDecision> = {
  "Approved for Registration": "APPROVED_FOR_REGISTRATION",
  "Approved for Derajat Shuhada Family Health Card": "APPROVED_FOR_HEALTH_CARD",
  "Returned for Completion / Further Verification": "RETURNED_FOR_COMPLETION",
};

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requirePermission("family", "authorize", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = authorizationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }
  const values = parsed.data;

  const family = await prisma.family.findUnique({ where: { id: Number(id) } });
  if (!family) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!family.verificationStatus) {
    return NextResponse.json(
      { error: "Section E (Official Verification) must be recorded before authorization" },
      { status: 400 },
    );
  }
  if (values.authorizationDecision === "Approved for Derajat Shuhada Family Health Card") {
    const allowedForCard = ["VERIFIED_ELIGIBLE", "PROVISIONALLY_VERIFIED"];
    if (!allowedForCard.includes(family.verificationStatus)) {
      return NextResponse.json(
        { error: "Health Card approval requires Section E status to be 'Verified & Eligible' or 'Provisionally Verified'" },
        { status: 400 },
      );
    }
  }

  const authorizationDateStr = values.authorizationDate || new Date().toISOString().split("T")[0];
  const authorizationDate = new Date(authorizationDateStr);
  const updated = await prisma.family.update({
    where: { id: Number(id) },
    data: {
      authorizationDecision: AUTHORIZATION_DECISION_MAP[values.authorizationDecision],
      authorizedOfficer: values.authorizedOfficer,
      authorizedDesignation: values.authorizedDesignation,
      authorizedSignature: values.authorizedSignature ? "Signed and stamped on paper" : null,
      authorizationDate,
    },
  });

  if (values.authorizationDecision === "Returned for Completion / Further Verification") {
    await prisma.family.update({
      where: { id: Number(id) },
      data: {
        authorizationDecision: null,
        authorizedOfficer: null,
        authorizedDesignation: null,
        authorizedSignature: null,
        authorizationDate: null,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      who: session.email ?? String(session.id),
      role: session.role,
      action: "authorization_recorded",
      entity: "family",
      entityId: String(family.id),
      hospitalId: session.hospitalId ?? null,
    },
  }).catch(() => {});

  return NextResponse.json({
    id: updated.id,
    registrationNo: updated.registrationNo,
    authorizationDecision: updated.authorizationDecision,
    authorizedOfficer: updated.authorizedOfficer,
    authorizedDesignation: updated.authorizedDesignation,
    authorizedSignature: updated.authorizedSignature,
    authorizationDate: updated.authorizationDate,
  });
}