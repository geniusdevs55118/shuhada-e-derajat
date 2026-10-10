import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, hospitalScope } from "@/lib/permissions";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  let user;
  try {
    user = await requirePermission("monthly_report", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { searchParams } = new URL(req.url);
  const resource = (searchParams.get("resource") || "cards").toLowerCase();

  let data: Record<string, unknown>[] = [];
  let sheetName = "Data";

  if (resource === "cards") {
    const cards = await prisma.healthCard.findMany({
      orderBy: { id: "desc" },
      take: 1000,
    });
    data = cards.map((c) => ({
      "Card No": c.cardNo,
      "Family Reg No": c.familyRegistrationNo,
      "Status": c.status,
      "Issue Date": c.dateOfCardIssue?.toISOString() ?? "",
      "DHQ Access": c.accessDHQ ? "Yes" : "No",
      "MMMTH Access": c.accessMMMTH ? "Yes" : "No",
      "W&C Access": c.accessWC ? "Yes" : "No",
    }));
    sheetName = "HealthCards";
  } else if (resource === "visits") {
    const visits = await prisma.visit.findMany({
      where: hospitalScope(user, "visit"),
      orderBy: { id: "desc" },
      take: 1000,
    });
    data = visits.map((v) => ({
      "Visit No": v.visitNo,
      "Date": v.dateTime.toISOString(),
      "Family Reg No": v.familyRegistrationNo,
      "Card No": v.healthCardNo ?? "",
      "Beneficiary Name": v.beneficiaryName,
      "Hospital ID": v.hospitalId,
      "Verification Status": v.verification,
    }));
    sheetName = "Visits";
  } else if (resource === "grievances") {
    const grievances = await prisma.grievance.findMany({
      where: hospitalScope(user, "grievance"),
      orderBy: { id: "desc" },
      take: 1000,
    });
    data = grievances.map((g) => ({
      "Grievance No": g.grievanceNo,
      "Date": g.dateTime.toISOString(),
      "Beneficiary": g.beneficiaryName,
      "Priority": g.priority,
      "Hospital ID": g.hospitalId,
      "Closure Status": g.closureStatus ?? "Pending",
    }));
    sheetName = "Grievances";
  } else {
    return NextResponse.json({ error: "Invalid resource. Choose cards, visits, or grievances." }, { status: 400 });
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="DSFHI-${sheetName}-Export.xlsx"`,
    },
  });
}
