"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const DAILY_DATA = [
  { label: "1st", amount: 35 },
  { label: "5th", amount: 48 },
  { label: "10th", amount: 12 },
  { label: "15th", amount: 75 },
  { label: "20th", amount: 62 },
  { label: "25th", amount: 190 },
  { label: "30th", amount: 210 },
];

const WEEKLY_DATA = [
  { label: "Wk 1", amount: 320 },
  { label: "Wk 2", amount: 480 },
  { label: "Wk 3", amount: 390 },
  { label: "Wk 4", amount: 610 },
];

const CATEGORY_SPLIT = [
  { name: "Housing", color: "#4f46e5", amount: 1500, total: 3395 },
  { name: "Food", color: "#f59e0b", amount: 1245, total: 3395 },
  { name: "Transport", color: "#10b981", amount: 450, total: 3395 },
  { name: "Entertainment", color: "#94a3b8", amount: 200, total: 3395 },
];

const MONTHLY_SUMMARY = [
  { month: "October 2023", spend: 3395.5, income: 5200.0, savings: 1804.5 },
  { month: "September 2023", spend: 3850.2, income: 5200.0, savings: 1349.8 },
  { month: "August 2023", spend: 4100.0, income: 5000.0, savings: 900.0 },
  { month: "July 2023", spend: 3620.0, income: 5000.0, savings: 1380.0 },
  { month: "June 2023", spend: 3980.0, income: 4800.0, savings: 820.0 },
];

const TIME_RANGES = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "This Year"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function ReportsPage() {
  const t = useTranslations();
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [chartView, setChartView] = useState<"Daily" | "Weekly">("Daily");
  const [rangeOpen, setRangeOpen] = useState(false);

  const chartData = chartView === "Daily" ? DAILY_DATA : WEEKLY_DATA;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-6 py-8">
      {/* Page Header */}
      <Reveal>
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[var(--color-on-surface)] text-3xl font-bold tracking-tight">
              {t("reports.heading")}
            </h1>
            <p className="mt-1 text-[var(--color-on-surface-variant)] text-base">
              {t("reports.subheading")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Time Range Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRangeOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-[var(--color-outline-variant)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-on-surface)] shadow-sm transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-md"
              >
                {selectedRange}
                <svg className="h-4 w-4 text-[var(--color-on-surface-variant)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {rangeOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-[var(--color-outline-variant)] bg-white py-1 shadow-lg">
                  {TIME_RANGES.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setSelectedRange(r); setRangeOpen(false); }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--color-surface-container-low)]",
                        selectedRange === r
                          ? "font-semibold text-[var(--color-primary)]"
                          : "text-[var(--color-on-surface)]"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Export Button */}
            <button className="flex items-center justify-center rounded-lg bg-[var(--color-primary)] p-2.5 text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-primary-container)] hover:shadow-md">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Reveal>

      {/* Stat Cards Row */}
      <Reveal delay={0.05}>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Highest Spend Category */}
          <div className="rounded-xl border border-[var(--color-outline-variant)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                {t("reports.stat.highestCategory")}
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <div className="text-3xl font-bold text-[var(--color-on-surface)]">$1,245.50</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                Food &amp; Dining
              </span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-rose-500">
                <ArrowUpRight className="h-3 w-3" />
                12% {t("reports.vsLastMonth")}
              </span>
            </div>
          </div>

          {/* Average Daily Spend */}
          <div className="rounded-xl border border-[var(--color-outline-variant)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                {t("reports.stat.avgDailySpend")}
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
            <div className="text-3xl font-bold text-[var(--color-on-surface)]">$85.20</div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ArrowDownRight className="h-3 w-3" />
              5% {t("reports.vsLastMonth")}
            </div>
          </div>

          {/* Budget Adherence */}
          <div className="rounded-xl border border-[var(--color-outline-variant)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                {t("reports.stat.budgetAdherence")}
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[var(--color-on-surface)]">82%</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                {t("reports.onTrack")}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-container)]">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Charts Row */}
      <Reveal delay={0.1}>
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Spending Trends Chart */}
          <div className="col-span-2 rounded-xl border border-[var(--color-outline-variant)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">
                {t("reports.spendingTrends")}
              </h2>
              <div className="flex items-center rounded-lg border border-[var(--color-outline-variant)] p-0.5">
                {(["Daily", "Weekly"] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setChartView(view)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
                      chartView === view
                        ? "bg-[var(--color-surface-container-low)] text-[var(--color-primary)]"
                        : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
                    )}
                  >
                    {view === "Daily" ? t("reports.daily") : t("reports.weekly")}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f8" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#777587" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#777587" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.75rem",
                    border: "1px solid #c7c4d8",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "13px",
                  }}
                  formatter={(value: number) => [`$${value}`, "Spent"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#spendGradient)"
                  dot={{ r: 3, fill: "#4f46e5", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#4f46e5", strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Split */}
          <div className="rounded-xl border border-[var(--color-outline-variant)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
            <h2 className="mb-5 text-lg font-semibold text-[var(--color-on-surface)]">
              {t("reports.categorySplit")}
            </h2>
            <div className="space-y-4">
              {CATEGORY_SPLIT.map((cat) => {
                const pct = Math.round((cat.amount / cat.total) * 100);
                return (
                  <div key={cat.name}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-sm font-medium text-[var(--color-on-surface)]">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                        {formatCurrency(cat.amount)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-container)]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Monthly Summary Table */}
      <Reveal delay={0.15}>
        <div className="rounded-xl border border-[var(--color-outline-variant)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] px-6 py-4">
            <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">
              {t("reports.monthlySummary")}
            </h2>
            <button className="text-sm font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-container)]">
              {t("reports.viewAllMonths")}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                    {t("reports.table.month")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                    {t("reports.table.totalSpend")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                    {t("reports.table.income")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                    {t("reports.table.netSavings")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY_SUMMARY.map((row, i) => (
                  <tr
                    key={row.month}
                    className={cn(
                      "border-b border-[var(--color-outline-variant)] transition-colors hover:bg-[var(--color-surface-container-low)]",
                      i === MONTHLY_SUMMARY.length - 1 && "border-b-0"
                    )}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--color-on-surface)]">
                      {row.month}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-on-surface)]">
                      {formatCurrency(row.spend)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-on-surface)]">
                      {formatCurrency(row.income)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-emerald-600">
                      +{formatCurrency(row.savings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </div>
  );
}