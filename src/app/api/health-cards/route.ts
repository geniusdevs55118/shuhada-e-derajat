import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, hospitalScope } from "@/lib/permissions";
import { generateCardSchema } from "@/lib/card-schemas";
import { generateHealthCardTransaction } from "@/lib/card-generation";
import { rateLimitCheck } from "@/lib/rate-limit-ip";

export async function GET(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("card", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const status = searchParams.get("status")?.trim();
  const category = searchParams.get("category")?.trim();
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = 10;

  const andConditions: Record<string, unknown>[] = [
    hospitalScope(session, "card"),
  ];

  if (category === "ghazi") {
    andConditions.push({
      OR: [
        { cardNo: { contains: "DG" } },
        { cardNo: { contains: "GZ" } },
        { familyRegistrationNo: { contains: "GZ" } },
        { familyRegistrationNo: { contains: "DG" } },
      ],
    });
  } else if (category === "shuhada") {
    andConditions.push({
      NOT: [
        { cardNo: { contains: "DG" } },
        { cardNo: { contains: "GZ" } },
        { familyRegistrationNo: { contains: "GZ" } },
        { familyRegistrationNo: { contains: "DG" } },
      ],
    });
  }

  if (search) {
    const famMatches = await prisma.family.findMany({
      where: { shaheedName: { contains: search } },
      select: { registrationNo: true },
    });
    andConditions.push({
      OR: [
        { cardNo: { contains: search } },
        { familyRegistrationNo: { contains: search } },
        { familyRegistrationNo: { in: famMatches.map((f) => f.registrationNo) } },
      ],
    });
  }
  if (status && status !== "all") {
    andConditions.push({ status });
  }

  const where = { AND: andConditions };

  const [total, cards] = await Promise.all([
    prisma.healthCard.count({ where }),
    prisma.healthCard.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const regNos = cards.map((c) => c.familyRegistrationNo);
  const cardNos = cards.map((c) => c.cardNo);
  const families = await prisma.family.findMany({
    where: {
      OR: [
        { registrationNo: { in: regNos } },
        { healthCardNo: { in: cardNos } },
      ],
    },
    select: { registrationNo: true, healthCardNo: true, shaheedName: true, contactCnic: true },
  });
  const famByReg = new Map(families.map((f) => [f.registrationNo, f]));
  const famByCard = new Map(families.filter((f) => f.healthCardNo).map((f) => [f.healthCardNo!, f]));
  const data = cards.map((c) => {
    const f = famByReg.get(c.familyRegistrationNo) ?? famByCard.get(c.cardNo);
    return {
      ...c,
      shaheedName: f?.shaheedName ?? null,
      contactCnic: f?.contactCnic ?? null,
    };
  });

  return NextResponse.json({
    total,
    page,
    pageSize,
    data,
  });
}

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("card", "create", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimitCheck(`health-cards:${ip}`, 20, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = generateCardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const result = await generateHealthCardTransaction(
      parsed.data.familyId,
      {
        id: session.id,
        email: session.email,
        role: session.role,
        hospitalId: session.hospitalId,
      },
      {
        specialFlags: parsed.data.specialFlags,
        controlFlags: parsed.data.controlFlags,
      }
    );

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to generate card";
    // Only genuine rule violations are the caller's fault. Anything else is a
    // server/DB problem and must not be reported as a bad request.
    const isRuleViolation =
      /family not found|already has a health card|health card already exists|must be authorized|not verified or eligible/i.test(msg);
    return NextResponse.json({ error: msg }, { status: isRuleViolation ? 400 : 500 });
  }
}
