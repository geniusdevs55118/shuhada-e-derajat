import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { requirePermission, AuthError } from "@/lib/permissions";
import { FamilyRegistrationPdf } from "@/lib/pdf/family-annexure-a";
import { VisitAnnexureBPdf } from "@/lib/pdf/visit-annexure-b";
import { MonthlyReportAnnexureDPdf } from "@/lib/pdf/report-annexure-d";
import { GrievanceAnnexureEPdf } from "@/lib/pdf/grievance-annexure-e";

export async function GET(req: NextRequest) {
  try {
    await requirePermission("family", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { searchParams } = new URL(req.url);
  const form = (searchParams.get("form") || "a").toLowerCase();

  let element: React.ReactElement;
  let filename = "Blank-Annexure.pdf";

  switch (form) {
    case "a":
      element = <FamilyRegistrationPdf family={{ members: [], documents: [] }} />;
      filename = "Blank-Annexure-A-Family-Registration.pdf";
      break;
    case "b":
      element = <VisitAnnexureBPdf visit={{}} />;
      filename = "Blank-Annexure-B-Healthcare-Facilitation.pdf";
      break;
    case "d":
      element = <MonthlyReportAnnexureDPdf report={{ actionItems: [] }} />;
      filename = "Blank-Annexure-D-Monthly-Report.pdf";
      break;
    case "e":
      element = <GrievanceAnnexureEPdf grievance={{ actions: [] }} />;
      filename = "Blank-Annexure-E-Grievance-Escalation.pdf";
      break;
    default:
      return NextResponse.json({ error: "Invalid form specified. Use a, b, d, or e." }, { status: 400 });
  }

  const buffer = await renderToBuffer(element as Parameters<typeof renderToBuffer>[0]);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
