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
import AppLayout from "@/components/AppLayout";

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

  function handleExportCSV() {
    const rows = [
      ["Month", "Total Spend", "Income", "Net Savings"],
      ...MONTHLY_SUMMARY.map((r) => [
        r.month,
        r.spend.toFixed(2),
        r.income.toFixed(2),
        r.savings.toFixed(2),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spendwise-monthly-summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppLayout pageTitle="Reports">
      <div className="max-w-[1280px] mx-auto">
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
                  <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-[var(--color-outline-variant)] bg-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] overflow-hidden">
                    {TIME_RANGES.map((range) => (
                      <button
                        key={range}
                        onClick={() => { setSelectedRange(range); setRangeOpen(false); }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors",
                          range === selectedRange
                            ? "bg-[var(--color-surface-container)] text-[var(--color-primary)] font-semibold"
                            : "text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)]"
                        )}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export CSV */}
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
        </Reveal>

        {/* KPI Cards */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Total Spend */}
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-3">Total Spend</p>
              <p className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight">{formatCurrency(3395.5)}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-[#ef4444] font-medium">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +12.4% vs last month
              </div>
            </div>

            {/* Total Income */}
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-3">Total Income</p>
              <p className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight">{formatCurrency(5200.0)}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-[#22c55e] font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                Stable this month
              </div>
            </div>

            {/* Net Savings */}
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-3">Net Savings</p>
              <p className="text-3xl font-bold text-[#22c55e] tracking-tight">{formatCurrency(1804.5)}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-[#22c55e] font-medium">
                <ArrowDownRight className="h-3.5 w-3.5" />
                34.7% savings rate
              </div>
            </div>
          </div>
        </Reveal>

        {/* Spending Chart */}
        <Reveal>
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-on-surface)]">Spending Over Time</h2>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{selectedRange}</p>
              </div>
              <div className="flex rounded-lg border border-[var(--color-outline-variant)] overflow-hidden">
                {(["Daily", "Weekly"] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setChartView(view)}
                    className={cn(
                      "px-4 py-1.5 text-xs font-medium transition-colors",
                      chartView === view
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-white text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]"
                    )}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f8" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#777587" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#777587" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #dce2f3",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Spend"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#spendGradient)"
                  dot={{ r: 3, fill: "#4f46e5", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#4f46e5" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        {/* Bottom row: Category Split + Monthly Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Split */}
          <Reveal>
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-5">Category Breakdown</h2>
              <div className="space-y-4">
                {CATEGORY_SPLIT.map((cat) => {
                  const pct = Math.round((cat.amount / cat.total) * 100);
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-sm font-medium text-[var(--color-on-surface)]">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[var(--color-on-surface-variant)]">{pct}%</span>
                          <span className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">{formatCurrency(cat.amount)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--color-surface-container-low)] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: cat.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Monthly Summary Table */}
          <Reveal>
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-5">Monthly Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-outline-variant)]">
                      <th className="text-left pb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">Month</th>
                      <th className="text-right pb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">Spend</th>
                      <th className="text-right pb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">Income</th>
                      <th className="text-right pb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-outline-variant)]">
                    {MONTHLY_SUMMARY.map((row) => (
                      <tr key={row.month} className="hover:bg-[var(--color-surface-container-low)] transition-colors">
                        <td className="py-3 font-medium text-[var(--color-on-surface)]">{row.month}</td>
                        <td className="py-3 text-right tabular-nums text-[#ef4444] font-semibold">{formatCurrency(row.spend)}</td>
                        <td className="py-3 text-right tabular-nums text-[var(--color-on-surface)]">{formatCurrency(row.income)}</td>
                        <td className="py-3 text-right tabular-nums text-[#22c55e] font-semibold">{formatCurrency(row.savings)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </AppLayout>
  );
}
