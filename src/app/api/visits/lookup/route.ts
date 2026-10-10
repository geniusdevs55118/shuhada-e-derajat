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
      verificationStatus: family.verificationStatus,
      contactName: family.contactName,
    },
    members: family.members.map((m) => ({
      id: m.id,
      name: m.name,
      relationship: m.relationship,
      cnicBForm: m.cnicBForm,
      mobile: m.mobile,
      beneficiaryId: m.beneficiaryId,
      cardStatus: m.cardStatus,
    })),
    beneficiary: member
      ? {
          name: member.name,
          fatherHusbandGuardian: null,
          cnicBForm: member.cnicBForm,
          relationship: member.relationship,
          mobile: member.mobile,
        }
      : null,
  });
}
