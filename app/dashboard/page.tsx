"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar, Plus, ArrowRight, Coffee, ShoppingBag, Car, SlidersHorizontal, Lock } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";

const DONUT_DATA = [
  { name: "Housing", value: 45, color: "#4f46e5" },
  { name: "Food", value: 30, color: "#f59e0b" },
  { name: "Transport", value: 15, color: "#10b981" },
  { name: "Other", value: 10, color: "#dce2f3" },
];

const RECENT_TRANSACTIONS = [
  {
    id: "1",
    merchant: "Starbucks Coffee",
    category: "Food & Drink",
    date: "Oct 24, 2023",
    amount: -5.5,
    Icon: Coffee,
    iconBg: "#f0f3ff",
    iconColor: "#4f46e5",
  },
  {
    id: "2",
    merchant: "Whole Foods Market",
    category: "Groceries",
    date: "Oct 23, 2023",
    amount: -84.2,
    Icon: ShoppingBag,
    iconBg: "#f0f3ff",
    iconColor: "#4f46e5",
  },
  {
    id: "3",
    merchant: "Uber Rides",
    category: "Transport",
    date: "Oct 22, 2023",
    amount: -24.0,
    Icon: Car,
    iconBg: "#f0f3ff",
    iconColor: "#4f46e5",
  },
];

const MONTHLY_BUDGET = 3000;
const MONTHLY_SPENT = 2145.5;
const SPENDING_PCT = Math.round((MONTHLY_SPENT / MONTHLY_BUDGET) * 100);

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 py-2 shadow-md text-sm">
        <span className="font-semibold text-[var(--color-on-surface)]">
          {payload[0].name}
        </span>
        <span className="ml-2 text-[var(--color-on-surface-variant)]">
          {payload[0].value}%
        </span>
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-6 py-8 max-w-[1280px] mx-auto">
      {/* Page header */}
      <Reveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-on-surface)] leading-tight">
              {t("dashboard.title")}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-[var(--color-outline-variant)] bg-white px-4 py-1.5 text-sm font-medium text-[var(--color-on-surface-variant)] shadow-sm">
              <Lock className="h-3.5 w-3.5" />
              {t("dashboard.privateBadge")}
            </span>
          </div>
        </div>
      </Reveal>

      {/* Top stat cards row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {/* Total Balance */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[160px]"
        >
          <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
            {t("dashboard.totalBalance")}
          </p>
          <div>
            <p className="text-[36px] font-bold text-[var(--color-on-surface)] leading-none mt-3 tracking-tight">
              $12,450<span className="text-2xl">.00</span>
            </p>
            <div className="flex items-center gap-1 mt-4">
              <TrendingUp className="h-4 w-4 text-[var(--color-secondary)]" />
              <span className="text-sm font-medium text-[var(--color-secondary)]">
                +2.4% {t("dashboard.vsLastMonth")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Monthly Spending */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[160px]"
        >
          <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
            {t("dashboard.monthlySpending")}
          </p>
          <div>
            <p className="text-[32px] font-bold text-[var(--color-on-surface)] leading-none mt-3 tracking-tight">
              $2,145<span className="text-xl">.50</span>
            </p>
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-[var(--color-surface-container-low)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: SPENDING_PCT + "%" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full bg-[var(--color-primary)]"
                />
              </div>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-1.5">
                {SPENDING_PCT}% {t("dashboard.ofBudget")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Remaining Budget */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[160px]"
        >
          <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
            {t("dashboard.remainingBudget")}
          </p>
          <div>
            <p className="text-[32px] font-bold text-[var(--color-on-surface)] leading-none mt-3 tracking-tight">
              $854<span className="text-xl">.50</span>
            </p>
            <div className="flex items-center gap-1.5 mt-4">
              <Calendar className="h-4 w-4 text-[var(--color-on-surface-variant)]" />
              <span className="text-sm text-[var(--color-on-surface-variant)]">
                12 {t("dashboard.daysLeft")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Add Expense CTA */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4 min-h-[160px] bg-[var(--color-primary)] shadow-[0_4px_24px_-4px_rgba(53,37,205,0.4)]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/40">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white leading-tight">
              {t("dashboard.addExpense")}
            </p>
            <p className="text-sm text-white/70 mt-0.5">
              {t("dashboard.addExpenseSubtitle")}
            </p>
          </div>
          <Link
            href="/expenses/new"
            className="flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-[var(--color-primary)] transition-all duration-200 hover:bg-white/90 hover:shadow-md"
          >
            {t("dashboard.logTransaction")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom two-column row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Categories / Donut Chart */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">
              {t("dashboard.categories")}
            </h2>
            <Link
              href="/categories"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              {t("dashboard.viewAll")}
            </Link>
          </div>

          {/* Donut chart */}
          <div className="relative flex items-center justify-center" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={DONUT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {DONUT_DATA.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[var(--color-on-surface)] leading-none">
                $2.1k
              </span>
              <span className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                {t("dashboard.spent")}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {DONUT_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-[var(--color-on-surface-variant)]">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">
              {t("dashboard.recentTransactions")}
            </h2>
            <SlidersHorizontal className="h-5 w-5 text-[var(--color-on-surface-variant)]" />
          </div>

          <div className="divide-y divide-[var(--color-outline-variant)]">
            {RECENT_TRANSACTIONS.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: tx.iconBg }}
                >
                  <tx.Icon className="h-5 w-5" style={{ color: tx.iconColor }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">
                    {tx.merchant}
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                    {tx.category} &bull; {tx.date}
                  </p>
                </div>

                <span className="text-sm font-bold text-[var(--color-error)] tabular-nums flex-shrink-0">
                  {tx.amount < 0
                    ? "-$" + Math.abs(tx.amount).toFixed(2)
                    : "+$" + tx.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)] text-center">
            <Link
              href="/transactions"
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              {t("dashboard.viewAllTransactions")}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
