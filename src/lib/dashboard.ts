import { prisma } from "@/lib/db";
import { hospitalScope, WG_ROLES, type SessionUser } from "@/lib/permissions";

export type HospitalBreakdown = {
  hospitalId: number;
  code: string;
  name: string;
  families: number;
  visitsThisMonth: number;
  openGrievances: number;
  redGrievances: number;
};

export type DashboardData = {
  counts: {
    families: number;
    visitsThisMonth: number;
    openGrievances: number;
    redGrievances: number;
  };
  perHospital: HospitalBreakdown[];
  userCount: number | null;
  chartData: { visitsByService: { service: string; visits: number }[]; emergencyCases: number; redAlertsByDay: { day: string; alerts: number }[] };
};

export function monthRange(d = new Date()): { gte: Date } {
  return { gte: new Date(d.getFullYear(), d.getMonth(), 1) };
}

export async function getDashboardData(user: SessionUser): Promise<DashboardData> {
  const month = monthRange();

  const [families, visitsThisMonth, openGrievances, redGrievances, chartVisits, chartGrievances] = await Promise.all([
    prisma.family.count({ where: hospitalScope(user, "family") }),
    prisma.visit.count({ where: { ...hospitalScope(user, "visit"), dateTime: month } }),
    prisma.grievance.count({ where: { ...hospitalScope(user, "grievance"), closureStatus: null } }),
    prisma.grievance.count({ where: { ...hospitalScope(user, "grievance"), isRedAlert: true, closureStatus: null } }),
    prisma.visit.findMany({ where: { ...hospitalScope(user, "visit"), dateTime: month }, select: { natureOfHealthcare: true, emergencyFlags: true, verification: true } }),
    prisma.grievance.findMany({ where: { ...hospitalScope(user, "grievance"), dateTime: month, isRedAlert: true }, select: { dateTime: true } }),
  ]);

  const showBreakdown =
    user.role === "super_admin" ||
    user.role === "hospital_director" ||
    user.role === "additional_director" ||
    (WG_ROLES.includes(user.role) && user.role !== "it_mis_rep");

  let perHospital: HospitalBreakdown[] = [];
  if (showBreakdown) {
    const hospitals = await prisma.hospital.findMany({ orderBy: { id: "asc" } });
    perHospital = await Promise.all(
      hospitals.map(async (h) => ({
        hospitalId: h.id,
        code: h.code,
        name: h.name,
        families: await prisma.family.count({ where: { hospitalId: h.id } }),
        visitsThisMonth: await prisma.visit.count({ where: { hospitalId: h.id, dateTime: month } }),
        openGrievances: await prisma.grievance.count({ where: { hospitalId: h.id, closureStatus: null } }),
        redGrievances: await prisma.grievance.count({ where: { hospitalId: h.id, isRedAlert: true, closureStatus: null } }),
      })),
    );
  }

  const userCount = user.role === "super_admin" || user.role === "it_mis_rep" ? await prisma.user.count() : null;

  const services = new Map<string, number>();
  let emergencyCases = 0;
  for (const visit of chartVisits) {
    const values = Array.isArray(visit.natureOfHealthcare) ? visit.natureOfHealthcare as string[] : [];
    for (const service of values) services.set(service, (services.get(service) ?? 0) + 1);
    const emergency = (visit.emergencyFlags ?? {}) as Record<string, unknown>;
    if (emergency.emergencyCase === true || visit.verification === "EMERGENCY_VERIFICATION_IN_PROCESS") emergencyCases++;
  }
  const redByDay = new Map<string, number>();
  for (const grievance of chartGrievances) {
    const day = grievance.dateTime.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
    redByDay.set(day, (redByDay.get(day) ?? 0) + 1);
  }
  const redAlertsByDay = [...redByDay].sort(([a], [b]) => a.localeCompare(b)).map(([day, alerts]) => ({ day: day.slice(5), alerts }));

  return { counts: { families, visitsThisMonth, openGrievances, redGrievances }, perHospital, userCount, chartData: { visitsByService: [...services].map(([service, visits]) => ({ service, visits })).sort((a, b) => b.visits - a.visits).slice(0, 10), emergencyCases, redAlertsByDay } };
}
