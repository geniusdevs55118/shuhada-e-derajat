import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";

// Fast beneficiary lookup by Card No, Family Reg No, or CNIC.
export async function GET(req: NextRequest) {
  try {
    await requirePermission("visit", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "q is required" }, { status: 400 });

  const family = await prisma.family.findFirst({
    where: {
      OR: [
        { registrationNo: q },
        { healthCardNo: q },
        { contactCnic: q },
        { members: { some: { cnicBForm: q } } },
      ],
    },
    include: { members: true },
  });

  if (!family) return NextResponse.json({ found: false }, { status: 404 });

  const member =
    family.members.find(
      (m) => m.cnicBForm === q || `${family.registrationNo}-${String(m.serialNo).padStart(2, "0")}` === q,
    ) ?? family.members[0];

  return NextResponse.json({
    found: true,
    family: {
      registrationNo: family.registrationNo,
      healthCardNo: family.healthCardNo,
      shaheedName: family.shaheedName,
      shaheedFatherName: family.shaheedFatherName,
      verificationStatus: family.verificationStatus,
      contactName: family.contactName,
    },
    members: family.members.map((m) => {
      const isChild =
        m.relationship?.toLowerCase().includes("son") ||
        m.relationship?.toLowerCase().includes("daughter") ||
        m.relationship?.toLowerCase().includes("child");
      const isSpouse =
        m.relationship?.toLowerCase().includes("spouse") ||
        m.relationship?.toLowerCase().includes("wife") ||
        m.relationship?.toLowerCase().includes("widow");
      const fatherHusband = isChild
        ? family.shaheedName
        : isSpouse
        ? `${family.shaheedName} (Husband)`
        : family.shaheedFatherName ?? family.shaheedName ?? null;

      return {
        id: m.id,
        name: m.name,
        relationship: m.relationship,
        cnicBForm: m.cnicBForm,
        mobile: m.mobile,
        beneficiaryId: m.beneficiaryId,
        cardStatus: m.cardStatus,
        fatherHusbandGuardian: fatherHusband,
      };
    }),
    beneficiary: member
      ? {
          name: member.name,
          fatherHusbandGuardian:
            member.relationship?.toLowerCase().includes("son") ||
            member.relationship?.toLowerCase().includes("daughter") ||
            member.relationship?.toLowerCase().includes("child")
              ? family.shaheedName
              : member.relationship?.toLowerCase().includes("spouse") ||
                member.relationship?.toLowerCase().includes("wife") ||
                member.relationship?.toLowerCase().includes("widow")
              ? `${family.shaheedName} (Husband)`
              : family.shaheedFatherName ?? family.shaheedName ?? null,
          cnicBForm: member.cnicBForm,
          relationship: member.relationship,
          mobile: member.mobile,
        }
      : null,
  });
}
