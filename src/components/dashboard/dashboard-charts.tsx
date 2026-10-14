"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  HeartPulse,
  TrendingUp,
  Stethoscope,
  Building,
  ShieldAlert,
} from "lucide-react";

type ChartDataProps = {
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

// Custom Sleek Tooltip for Area/Bar charts
function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-700/80 bg-slate-900/95 p-3 text-white shadow-2xl backdrop-blur-md">
        <p className="border-b border-slate-800 pb-1.5 text-xs font-semibold text-slate-300">{label}</p>
        <div className="mt-2 space-y-1.5">
          {payload.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="size-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
                {item.name}:
              </span>
              <span className="font-bold tabular-nums text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function DashboardCharts({ data }: { data: ChartDataProps }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"trend" | "services">("trend");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid h-72 place-items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 text-sm text-slate-500">
          <Activity className="size-4 animate-spin text-blue-600" />
          <span>Loading analytics visualizations...</span>
        </div>
      </div>
    );
  }

  const resolutionRate =
    data.totalGrievancesRecorded > 0
      ? Math.round((data.resolvedGrievancesCount / data.totalGrievancesRecorded) * 100)
      : 100;

  return (
    <section className="space-y-5">
      {/* Analytics Section Header & Quick Stat Strip */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white">
                Clinical Analytics & Patient Inflow
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-blue-200/80">
              Real-time monitoring across hospital facilitation desks and department queues
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
              Live Network Insights
            </span>
          </div>
        </div>

        {/* 4 Interactive KPI Metric Pills */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-blue-300">
              <span className="text-[11px] font-medium uppercase tracking-wider">Patient Visits</span>
              <Activity className="size-4" />
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-white tabular-nums">
              {data.totalVisitsRecorded}
            </p>
            <p className="text-[10px] text-blue-200/70">Total logged in portal</p>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-red-300">
              <span className="text-[11px] font-medium uppercase tracking-wider">Emergency Cases</span>
              <AlertCircle className="size-4 text-red-400" />
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-red-100 tabular-nums">
              {data.emergencyCases}
            </p>
            <p className="text-[10px] text-red-200/70">Concurrent emergency care</p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-emerald-300">
              <span className="text-[11px] font-medium uppercase tracking-wider">Routine Care</span>
              <CheckCircle2 className="size-4 text-emerald-400" />
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-100 tabular-nums">
              {data.routineCases}
            </p>
            <p className="text-[10px] text-emerald-200/70">OPD & follow-ups</p>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-amber-300">
              <span className="text-[11px] font-medium uppercase tracking-wider">Grievance Solved</span>
              <HeartPulse className="size-4 text-amber-400" />
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-amber-100 tabular-nums">
              {resolutionRate}%
            </p>
            <p className="text-[10px] text-amber-200/70">
              {data.resolvedGrievancesCount} of {data.totalGrievancesRecorded} addressed
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Chart 1: Daily Inflow Trend (Spans 7 columns on desktop) */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="size-4 text-blue-600" />
                Daily Patient Inflow & Emergency Volume
              </h3>
              <p className="text-xs text-slate-500">Routine outpatient vs urgent emergency timeline</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-blue-700">
                <span className="size-2.5 rounded-full bg-blue-600" /> Routine
              </span>
              <span className="flex items-center gap-1.5 text-red-600">
                <span className="size-2.5 rounded-full bg-red-600" /> Emergency
              </span>
            </div>
          </div>

          <div className="mt-4 h-72">
            {data.dailyVisitsTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.dailyVisitsTrend}
                  margin={{ top: 10, right: 12, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="routineColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="emergencyColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="routine"
                    name="Routine Visits"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#routineColor)"
                  />
                  <Area
                    type="monotone"
                    dataKey="emergency"
                    name="Emergency Cases"
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#emergencyColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <Clock className="size-8 stroke-[1.5]" />
                <p className="mt-2 text-xs font-medium">No visit volume trend recorded yet for this period.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Healthcare Services Demand Breakdown (Spans 5 columns on desktop) */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="size-4 text-emerald-600" />
                Services & Specialty Demand
              </h3>
              <p className="text-xs text-slate-500">Distribution of care requested by Shuhada families</p>
            </div>
          </div>

          <div className="mt-4 h-72">
            {data.visitsByService.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.visitsByService}
                  layout="vertical"
                  margin={{ top: 0, right: 24, left: 24, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis
                    type="category"
                    dataKey="service"
                    tick={{ fontSize: 10, fill: "#334155" }}
                    width={90}
                    tickFormatter={(val: string) => (val.length > 14 ? val.slice(0, 14) + "…" : val)}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar dataKey="visits" name="Visits" fill="#0284c7" radius={[0, 6, 6, 0]}>
                    {data.visitsByService.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#1d4ed8" : index === 1 ? "#0284c7" : index === 2 ? "#0d9488" : "#64748b"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <Stethoscope className="size-8 stroke-[1.5]" />
                <p className="mt-2 text-xs font-medium">No service records available.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Analytics Row: Department Queue Load & Grievance Safety Status */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Department Queue Breakdown */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm lg:col-span-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building className="size-4 text-blue-600" />
              <div>
                <h3 className="font-heading text-sm font-bold text-slate-900">Department Queue Workload</h3>
                <p className="text-xs text-slate-500">Active distribution of visits across clinical departments</p>
              </div>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              Hospital Units
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {data.departmentBreakdown.length > 0 ? (
              data.departmentBreakdown.map((dept, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{dept.department}</span>
                    <span className="font-semibold text-slate-900">
                      {dept.count} <span className="text-[11px] font-normal text-slate-400">({dept.percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0
                          ? "bg-blue-600"
                          : idx === 1
                          ? "bg-emerald-500"
                          : idx === 2
                          ? "bg-amber-500"
                          : idx === 3
                          ? "bg-purple-500"
                          : "bg-slate-400"
                      }`}
                      style={{ width: `${Math.max(dept.percentage, 8)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-slate-400">No department queue data logged.</p>
            )}
          </div>
        </div>

        {/* Grievances & Patient Safety Escalation Status */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm lg:col-span-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-red-600" />
              <div>
                <h3 className="font-heading text-sm font-bold text-slate-900">Grievances & Rapid Escalation Screen</h3>
                <p className="text-xs text-slate-500">Patient safety alerts, urgent issues, and resolution status</p>
              </div>
            </div>
            <span className="rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
              Quality Assurance
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data.grievancesByStatus.map((status, i) => (
              <div
                key={i}
                className="rounded-xl border p-3 text-center transition-all"
                style={{ borderColor: `${status.color}30`, backgroundColor: `${status.color}08` }}
              >
                <span
                  className="mx-auto inline-block size-2.5 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <p className="mt-1 text-2xl font-bold tabular-nums" style={{ color: status.color }}>
                  {status.count}
                </p>
                <p className="mt-0.5 text-[11px] font-medium leading-tight text-slate-600">{status.name}</p>
              </div>
            ))}
          </div>

          {/* Red Alert Timeline Bar */}
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Daily Red Alerts (Immediate Safety Needs):</span>
              <span className="font-bold text-red-600">
                {data.redAlertsByDay.reduce((sum, d) => sum + d.alerts, 0)} total
              </span>
            </div>
            {data.redAlertsByDay.length > 0 ? (
              <div className="mt-2.5 flex items-end gap-2 h-14">
                {data.redAlertsByDay.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-red-600 transition-all hover:bg-red-700"
                      style={{ height: `${Math.min(item.alerts * 24, 44)}px` }}
                      title={`${item.day}: ${item.alerts} alerts`}
                    />
                    <span className="text-[9px] text-slate-500">{item.day}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-center text-xs text-slate-400">
                Zero active red alerts for the selected period.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
