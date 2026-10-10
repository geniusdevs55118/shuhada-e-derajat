import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";
import { verificationSchema } from "@/lib/family-schemas";
import { VerificationStatus } from "@prisma/client";

const VERIFICATION_STATUS_MAP: Record<string, VerificationStatus> = {
  "Verified & Eligible": "VERIFIED_ELIGIBLE",
  "Provisionally Verified": "PROVISIONALLY_VERIFIED",
  "Additional Documentation Required": "ADDITIONAL_DOCUMENTATION_REQUIRED",
  "Not Eligible": "NOT_ELIGIBLE",
};

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requirePermission("family", "record_verification", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = verificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }
  const values = parsed.data;

  const family = await prisma.family.findUnique({ where: { id: Number(id) } });
  if (!family) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const verifiedSignatureDate = new Date().toISOString().split("T")[0];
  const updated = await prisma.family.update({
    where: { id: Number(id) },
    data: {
      verificationStatus: VERIFICATION_STATUS_MAP[values.verificationStatus],
      verificationRefNo: values.verificationRefNo,
      verificationAuthority: values.verificationAuthority,
      verificationRemarks: values.verificationRemarks || null,
      verifiedBy: session.email ?? "unknown",
      verifiedByDesignation: session.role === "health_desk_officer" ? "Focal Person Health Desk / Family Facilitation" : "Focal Person Health Desk / Family Facilitation",
      verifiedSignatureDate,
      // Editing Section E clears Section I authorization
      authorizationDecision: null,
      authorizedOfficer: null,
      authorizedDesignation: null,
      authorizedSignature: null,
      authorizationDate: null,
    },
  });

  await prisma.auditLog.create({
    data: {
      who: session.email ?? String(session.id),
      role: session.role,
      action: "verification_recorded",
      entity: "family",
      entityId: String(family.id),
      hospitalId: session.hospitalId ?? null,
    },
  }).catch(() => {});

  return NextResponse.json({
    id: updated.id,
    registrationNo: updated.registrationNo,
    verificationStatus: updated.verificationStatus,
    verificationRefNo: updated.verificationRefNo,
    verificationAuthority: updated.verificationAuthority,
    verificationRemarks: updated.verificationRemarks,
    verifiedBy: updated.verifiedBy,
    verifiedByDesignation: updated.verifiedByDesignation,
    verifiedSignatureDate: updated.verifiedSignatureDate,
  });
}