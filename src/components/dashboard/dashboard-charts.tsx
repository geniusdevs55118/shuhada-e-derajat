"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Data = { visitsByService: { service: string; visits: number }[]; emergencyCases: number; redAlertsByDay: { day: string; alerts: number }[] };

export function DashboardCharts({ data }: { data: Data }) {
  return <section className="grid gap-4 lg:grid-cols-2">
    <div className="rounded-xl border bg-white p-4 shadow-sm"><h2 className="mb-3 font-semibold text-blue-950">Visits by service this month</h2>{data.visitsByService.length ? <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.visitsByService} margin={{ left: -16, right: 8, bottom: 28 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="service" angle={-25} textAnchor="end" interval={0} height={60} tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="visits" fill="#1d4ed8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div> : <p className="py-12 text-center text-sm text-gray-500">No visit service data for this month.</p>}</div>
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-4 shadow-sm"><h2 className="font-semibold text-blue-950">Emergency cases this month</h2><p className="mt-2 text-4xl font-bold text-red-700">{data.emergencyCases}</p><p className="text-sm text-gray-600">Recorded as emergency or pending verification</p></div>
      <div className="rounded-xl border bg-white p-4 shadow-sm"><h2 className="mb-2 font-semibold text-blue-950">RED grievance alerts by day</h2>{data.redAlertsByDay.length ? <div className="h-44"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.redAlertsByDay}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="alerts" fill="#dc2626" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div> : <p className="py-8 text-center text-sm text-gray-500">No RED alerts this month.</p>}</div>
    </div>
  </section>;
}
