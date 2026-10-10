import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { AuthError, can, requireUser } from "@/lib/permissions";

const TOR_TITLES = [
  "Review monthly hospital reports", "Monitor verification and card issuance", "Review emergency facilitation safeguards", "Track OPD and specialist access", "Review diagnostics and radiology coordination", "Review pharmacy availability concerns", "Monitor admission and procedure coordination", "Review Sehat Card Plus processing and claim controls", "Review ambulance and referral coordination", "Examine grievances and RED alerts", "Assign corrective actions and track completion", "Record meeting decisions and follow-up",
];
const writeSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("member"), name: z.string().trim().min(1).max(120), roleTitle: z.string().trim().min(1).max(120), designation: z.string().max(120).optional(), hospital: z.string().max(120).optional() }),
  z.object({ type: z.literal("tor"), number: z.number().int().min(1).max(12), owner: z.string().max(120).optional(), status: z.enum(["Pending", "In Progress", "Completed"]) }),
  z.object({ type: z.literal("minute"), meetingDate: z.string().min(1), title: z.string().trim().min(1).max(200), attendees: z.string().max(3000).optional(), decisions: z.string().trim().min(1).max(5000) }),
]);

async function authorize(req: NextRequest) {
  const user = await requireUser(req);
  if (!can({ id: user.id, role: user.role, hospitalId: user.hospitalId }, "working_group", "read")) throw new AuthError(403, "Forbidden");
  return user;
}

export async function GET(req: NextRequest) {
  let session;
  try { session = await authorize(req); }
  catch (error) { if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status }); throw error; }
  await Promise.all(TOR_TITLES.map((title, index) => prisma.torItem.upsert({ where: { number: index + 1 }, create: { number: index + 1, title }, update: {} })));
  const [extraMembers, users, terms, minutes] = await Promise.all([
    prisma.workingGroupMember.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ where: { isActive: true, role: { in: ["hospital_director", "additional_director", "medical_superintendent", "health_desk_officer", "admin_finance_rep", "sehat_card_desk", "pharmacy_rep", "diagnostics_rep", "nursing_rep", "it_mis_rep"] as const } }, include: { hospital: { select: { code: true } } }, orderBy: { name: "asc" } }),
    prisma.torItem.findMany({ orderBy: { number: "asc" } }),
    prisma.meetingMinute.findMany({ orderBy: { meetingDate: "desc" }, take: 50 }),
  ]);
  const members = [
    ...users.map((user) => ({ id: `user-${user.id}`, name: user.name, roleTitle: user.designation ?? user.role.replaceAll("_", " "), hospital: user.hospital?.code ?? "All hospitals" })),
    ...extraMembers.map((member) => ({ id: `member-${member.id}`, name: member.name, roleTitle: member.roleTitle, hospital: member.hospital ?? "" })),
  ];
  return NextResponse.json({ members, terms, minutes, canManage: session.role === "additional_director" || session.role === "hospital_director" || session.role === "it_mis_rep" });
}

export async function POST(req: NextRequest) {
  let session;
  try { session = await authorize(req); }
  catch (error) { if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status }); throw error; }
  if (!["additional_director", "hospital_director", "it_mis_rep"].includes(session.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = writeSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation failed" }, { status: 400 });
  const value = parsed.data;
  let id: number;
  if (value.type === "member") {
    const member = await prisma.workingGroupMember.create({ data: { name: value.name, roleTitle: value.roleTitle, designation: value.designation || null, hospital: value.hospital || null } });
    id = member.id;
  } else if (value.type === "tor") {
    const term = await prisma.torItem.upsert({ where: { number: value.number }, create: { number: value.number, title: TOR_TITLES[value.number - 1], owner: value.owner || null, status: value.status }, update: { owner: value.owner || null, status: value.status } });
    id = term.id;
  } else {
    const date = new Date(value.meetingDate);
    if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "Invalid meeting date" }, { status: 400 });
    const minute = await prisma.meetingMinute.create({ data: { meetingDate: date, title: value.title, attendees: value.attendees || null, decisions: value.decisions, createdBy: session.email ?? String(session.id) } });
    id = minute.id;
  }
  await prisma.auditLog.create({ data: { who: session.email ?? String(session.id), role: session.role, action: "working_group_update", entity: `working_group_${value.type}`, entityId: String(id), hospitalId: session.hospitalId } }).catch(() => {});
  return NextResponse.json({ id, ok: true }, { status: 201 });
}
