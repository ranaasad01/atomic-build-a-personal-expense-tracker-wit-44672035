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
                  <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-[var(--color-outline-variant)] bg-white py-1 shadow-lg">
                    {TIME_RANGES.map((r) => (
                      <button
                        key={r}
                        onClick={() => { setSelectedRange(r); setRangeOpen(false); }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--color-surface-container-low)]",
                          r === selectedRange
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
            </div>
          </div>
        </Reveal>

        {/* ── Insight Stat Cards ── */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Highest Spend Category */}
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase mb-3">
                {t("reports.highestCategory")}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">Housing</p>
                  <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">44.2% of total spend</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#ede9fe] flex items-center justify-center">
                  <span className="text-[#4f46e5] text-lg">🏠</span>
                </div>
              </div>
            </div>

            {/* Average Daily Spend */}
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase mb-3">
                {t("reports.avgDailySpend")}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">$113.18</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-danger)]" />
                    <p className="text-sm text-[var(--color-danger)]">+8.4% vs last month</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#fef3c7] flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-[#f59e0b]" />
                </div>
              </div>
            </div>

            {/* Budget Adherence */}
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase mb-3">
                {t("reports.budgetAdherence")}
              </p>
              <div className="mb-2 flex items-end justify-between">
                <p className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">71.5%</p>
                <div className="flex items-center gap-1">
                  <ArrowDownRight className="h-3.5 w-3.5 text-[var(--color-success)]"/>
                  <span className="text-sm text-[var(--color-success)]">On track</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--color-surface-container-high)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                  style={{ width: "71.5%" }}
                />
              </div>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-1.5">$2,145 of $3,000 budget used</p>
            </div>
          </div>
        </Reveal>

        {/* ── Spending Trends Chart ── */}
        <Reveal>
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-on-surface)]">
                  {t("reports.spendingTrends")}
                </h2>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
                  {selectedRange}
                </p>
              </div>
              {/* Daily / Weekly toggle */}
              <div className="flex items-center gap-1 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-1">
                {(["Daily", "Weekly"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setChartView(v)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                      chartView === v
                        ? "bg-white text-[var(--color-primary)] shadow-sm border border-[var(--color-outline-variant)]"
                        : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "var(--color-on-surface-variant)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--color-on-surface-variant)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid var(--color-outline-variant)",
                    fontSize: "13px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Spend"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fill="url(#spendGradient)"
                  dot={{ r: 4, fill: "#4f46e5", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#4f46e5" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        {/* ── Bottom row: Category Split + Monthly Summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Category Split */}
          <Reveal className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] h-full">
              <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-5">
                {t("reports.categorySplit")}
              </h2>
              <div className="space-y-4">
                {CATEGORY_SPLIT.map((cat) => {
                  const pct = Math.round((cat.amount / cat.total) * 100);
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full"
                            style={{ background: cat.color }}
                          />
                          <span className="text-sm font-medium text-[var(--color-on-surface)]">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[var(--color-on-surface-variant)]">{pct}%</span>
                          <span className="text-sm font-semibold text-[var(--color-on-surface)] tabular-nums">
                            {formatCurrency(cat.amount)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[var(--color-surface-container-high)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: cat.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Monthly Summary Table */}
          <Reveal className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-[var(--color-on-surface)]">
                  {t("reports.monthlySummary")}
                </h2>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-on-surface)] shadow-sm transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-md"
                >
                  <Download className="h-4 w-4" />
                  {t("reports.exportCSV")}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-outline-variant)]">
                      <th className="pb-3 text-left text-xs font-semibold tracking-wider text-[var(--color-on-surface-variant)] uppercase">Month</th>
                      <th className="pb-3 text-right text-xs font-semibold tracking-wider text-[var(--color-on-surface-variant)] uppercase">Spend</th>
                      <th className="pb-3 text-right text-xs font-semibold tracking-wider text-[var(--color-on-surface-variant)] uppercase">Income</th>
                      <th className="pb-3 text-right text-xs font-semibold tracking-wider text-[var(--color-on-surface-variant)] uppercase">Savings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-outline-variant)]">
                    {MONTHLY_SUMMARY.map((row) => (
                      <tr key={row.month} className="hover:bg-[var(--color-surface-container-low)] transition-colors">
                        <td className="py-3 font-medium text-[var(--color-on-surface)]">{row.month}</td>
                        <td className="py-3 text-right tabular-nums text-[var(--color-danger)] font-medium">
                          {formatCurrency(row.spend)}
                        </td>
                        <td className="py-3 text-right tabular-nums text-[var(--color-success)] font-medium">
                          {formatCurrency(row.income)}
                        </td>
                        <td className="py-3 text-right tabular-nums font-semibold">
                          <span
                            className={cn(
                              row.savings >= 0
                                ? "text-[var(--color-success)]"
                                : "text-[var(--color-danger)]"
                            )}
                          >
                            {row.savings >= 0 ? "+" : ""}{formatCurrency(row.savings)}
                          </span>
                        </td>
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
