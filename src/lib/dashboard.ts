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
  chartData: {
    visitsByService: { service: string; visits: number; percentage: number }[];
    emergencyCases: number;
    routineCases: number;
    redAlertsByDay: { day: string; alerts: number }[];
    dailyVisitsTrend: { day: string; rawDate: string; visits: number; emergency: number; routine: number }[];
    departmentBreakdown: { department: string; count: number; percentage: number }[];
    grievancesByStatus: { name: string; count: number; color: string }[];
    totalVisitsRecorded: number;
    totalGrievancesRecorded: number;
    resolvedGrievancesCount: number;
  };
};

export function monthRange(d = new Date()): { gte: Date } {
  return { gte: new Date(d.getFullYear(), d.getMonth(), 1) };
}

export async function getDashboardData(user: SessionUser): Promise<DashboardData> {
  const month = monthRange();

  const [
    families,
    visitsThisMonth,
    openGrievances,
    redGrievances,
    monthVisits,
    allGrievances,
    totalVisitsRecorded,
  ] = await Promise.all([
    prisma.family.count({ where: hospitalScope(user, "family") }),
    prisma.visit.count({ where: { ...hospitalScope(user, "visit"), dateTime: month } }),
    prisma.grievance.count({ where: { ...hospitalScope(user, "grievance"), closureStatus: null } }),
    prisma.grievance.count({ where: { ...hospitalScope(user, "grievance"), isRedAlert: true, closureStatus: null } }),
    prisma.visit.findMany({
      where: { ...hospitalScope(user, "visit"), dateTime: month },
      select: { dateTime: true, natureOfHealthcare: true, emergencyFlags: true, verification: true, department: true },
      orderBy: { dateTime: "asc" },
    }),
    prisma.grievance.findMany({
      where: hospitalScope(user, "grievance"),
      select: { dateTime: true, isRedAlert: true, closureStatus: true, priority: true },
      orderBy: { dateTime: "asc" },
    }),
    prisma.visit.count({ where: hospitalScope(user, "visit") }),
  ]);

  // If current month has very few visits (e.g. beginning of month), also load recent visits for rich charts
  let chartVisits = monthVisits;
  if (chartVisits.length < 5) {
    const recent = await prisma.visit.findMany({
      where: hospitalScope(user, "visit"),
      select: { dateTime: true, natureOfHealthcare: true, emergencyFlags: true, verification: true, department: true },
      orderBy: { dateTime: "desc" },
      take: 30,
    });
    if (recent.length > 0) {
      chartVisits = recent.reverse();
    }
  }

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

  // Process visits by service, emergency vs routine, and daily trend
  const services = new Map<string, number>();
  const departments = new Map<string, number>();
  const dayMap = new Map<string, { visits: number; emergency: number; routine: number; rawDate: string }>();
  let emergencyCases = 0;
  let routineCases = 0;

  for (const visit of chartVisits) {
    const values = Array.isArray(visit.natureOfHealthcare) ? (visit.natureOfHealthcare as string[]) : [];
    for (const service of values) {
      services.set(service, (services.get(service) ?? 0) + 1);
    }

    const dept = visit.department ? visit.department.trim() : "General";
    departments.set(dept, (departments.get(dept) ?? 0) + 1);

    const flags = visit.emergencyFlags;
    const isEmergency =
      (Array.isArray(flags) && flags.some((f) => typeof f === "string" && f.toLowerCase().includes("emergency"))) ||
      (typeof flags === "object" && flags !== null && (flags as Record<string, unknown>).emergencyCase === true) ||
      visit.verification === "EMERGENCY_VERIFICATION_IN_PROCESS";

    if (isEmergency) {
      emergencyCases++;
    } else {
      routineCases++;
    }

    // Format day as "14 Oct"
    const dateObj = new Date(visit.dateTime);
    const dayKey = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "Asia/Karachi" });
    const rawDate = dateObj.toISOString().slice(0, 10);
    const currentDay = dayMap.get(dayKey) ?? { visits: 0, emergency: 0, routine: 0, rawDate };
    currentDay.visits += 1;
    if (isEmergency) currentDay.emergency += 1;
    else currentDay.routine += 1;
    dayMap.set(dayKey, currentDay);
  }

  const totalServicesCount = [...services.values()].reduce((sum, n) => sum + n, 0) || 1;
  const visitsByService = [...services]
    .map(([service, visits]) => ({
      service,
      visits,
      percentage: Math.round((visits / totalServicesCount) * 100),
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 8);

  const totalDeptCount = [...departments.values()].reduce((sum, n) => sum + n, 0) || 1;
  const departmentBreakdown = [...departments]
    .map(([department, count]) => ({
      department,
      count,
      percentage: Math.round((count / totalDeptCount) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const dailyVisitsTrend = [...dayMap.entries()].map(([day, val]) => ({
    day,
    rawDate: val.rawDate,
    visits: val.visits,
    emergency: val.emergency,
    routine: val.routine,
  }));

  // Process grievances
  const redByDay = new Map<string, number>();
  let redAlertGrievanceCount = 0;
  let urgentGrievanceCount = 0;
  let routineGrievanceCount = 0;
  let resolvedGrievancesCount = 0;

  for (const grievance of allGrievances) {
    if (grievance.closureStatus === "RESOLVED_CLOSED" || grievance.closureStatus === "CLOSED_WITH_CORRECTIVE_ACTION") {
      resolvedGrievancesCount++;
    } else if (grievance.isRedAlert || grievance.priority === "IMMEDIATE_PATIENT_SAFETY") {
      redAlertGrievanceCount++;
      const day = grievance.dateTime.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
      redByDay.set(day, (redByDay.get(day) ?? 0) + 1);
    } else if (grievance.priority === "URGENT") {
      urgentGrievanceCount++;
    } else {
      routineGrievanceCount++;
    }
  }

  const redAlertsByDay = [...redByDay]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, alerts]) => ({ day: day.slice(5), alerts }));

  const grievancesByStatus = [
    { name: "Red Alert (Critical)", count: redAlertGrievanceCount, color: "#dc2626" },
    { name: "Urgent Priority", count: urgentGrievanceCount, color: "#f59e0b" },
    { name: "Routine Open", count: routineGrievanceCount, color: "#3b82f6" },
    { name: "Resolved / Closed", count: resolvedGrievancesCount, color: "#10b981" },
  ];

  return {
    counts: { families, visitsThisMonth, openGrievances, redGrievances },
    perHospital,
    userCount,
    chartData: {
      visitsByService,
      emergencyCases,
      routineCases,
      redAlertsByDay,
      dailyVisitsTrend,
      departmentBreakdown,
      grievancesByStatus,
      totalVisitsRecorded,
      totalGrievancesRecorded: allGrievances.length,
      resolvedGrievancesCount,
    },
  };
}
