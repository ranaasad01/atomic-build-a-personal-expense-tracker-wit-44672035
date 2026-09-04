"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Plus, Check, X, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import AppLayout from "@/components/AppLayout";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  spent: number;
  budget: number;
}

const INITIAL_BUDGETS: BudgetCategory[] = [
  { id: "housing",       name: "Housing",       icon: "home",          color: "#4f46e5", spent: 1500, budget: 2000 },
  { id: "food",          name: "Food & Drink",  icon: "restaurant",    color: "#f59e0b", spent: 1245, budget: 1500 },
  { id: "transport",     name: "Transport",     icon: "directions_car",color: "#10b981", spent: 450,  budget: 600  },
  { id: "groceries",     name: "Groceries",     icon: "shopping_cart", color: "#6366f1", spent: 380,  budget: 500  },
  { id: "software",      name: "Software",      icon: "computer",      color: "#3730a3", spent: 288,  budget: 300  },
  { id: "travel",        name: "Travel",        icon: "flight",        color: "#f97316", spent: 650,  budget: 1000 },
  { id: "healthcare",    name: "Healthcare",    icon: "favorite",      color: "#ec4899", spent: 120,  budget: 400  },
  { id: "entertainment", name: "Entertainment", icon: "movie",         color: "#8b5cf6", spent: 295,  budget: 250  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getProgressColor(pct: number): string {
  if (pct >= 100) return "#ef4444";
  if (pct >= 80) return "#f59e0b";
  return "#22c55e";
}

function getProgressBg(pct: number): string {
  if (pct >= 100) return "bg-[#ef4444]";
  if (pct >= 80) return "bg-[#f59e0b]";
  return "bg-[#22c55e]";
}

interface BudgetCardProps {
  category: BudgetCategory;
  onUpdate: (id: string, newBudget: number) => void;
}

function BudgetCard({ category, onUpdate }: BudgetCardProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(category.budget));

  const pct = Math.min((category.spent / category.budget) * 100, 100);
  const isOverBudget = category.spent > category.budget;
  const progressColor = getProgressColor(pct);
  const progressBg = getProgressBg(pct);
  const remaining = category.budget - category.spent;

  function handleSave() {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdate(category.id, parsed);
    }
    setEditing(false);
  }

  function handleCancel() {
    setInputValue(String(category.budget));
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  }

  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        "bg-white rounded-2xl border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_2px_4px_-1px_rgba(0,0,0,0.04)]",
        isOverBudget
          ? "border-l-4 border-l-[#ef4444] border-t-[var(--color-outline-variant)] border-r-[var(--color-outline-variant)] border-b-[var(--color-outline-variant)]"
          : "border-[var(--color-outline-variant)]"
      )}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: category.color + "18" }}
          >
            <span
              className="material-symbols-outlined text-[20px] leading-none"
              style={{ color: category.color }}
              aria-hidden="true"
            >
              {category.icon}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-on-surface)]">{category.name}</p>
            {isOverBudget && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#ef4444] mt-0.5">
                <AlertTriangle className="h-3 w-3" />
                Over budget
              </span>
            )}
          </div>
        </div>

        {/* Edit budget button */}
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-[var(--color-primary)] hover:underline transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
              aria-label="Save budget"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleCancel}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
              aria-label="Cancel edit"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Budget amount */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-0.5">Spent</p>
          <p className="text-xl font-bold tabular-nums" style={{ color: isOverBudget ? "#ef4444" : "var(--color-on-surface)" }}>
            {formatCurrency(category.spent)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-0.5">Budget</p>
          {editing ? (
            <div className="flex items-center gap-1">
              <span className="text-sm text-[var(--color-on-surface-variant)]">$</span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-24 h-8 rounded-lg border border-[var(--color-primary)] bg-white px-2 text-sm font-semibold text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] tabular-nums"
              />
            </div>
          ) : (
            <p className="text-xl font-bold tabular-nums text-[var(--color-on-surface-variant)]">
              {formatCurrency(category.budget)}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-2 w-full rounded-full bg-[var(--color-surface-container-low)] overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", progressBg)}
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs tabular-nums" style={{ color: progressColor }}>
            {Math.round(pct)}% used
          </span>
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              remaining < 0 ? "text-[#ef4444]" : "text-[var(--color-on-surface-variant)]"
            )}
          >
            {remaining < 0
              ? `${formatCurrency(Math.abs(remaining))} over`
              : `${formatCurrency(remaining)} left`}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function BudgetPage() {
  const t = useTranslations();
  const [budgets, setBudgets] = useState<BudgetCategory[]>(INITIAL_BUDGETS);

  const totalBudget = budgets.reduce((s, c) => s + c.budget, 0);
  const totalSpent = budgets.reduce((s, c) => s + c.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPct = Math.min((totalSpent / totalBudget) * 100, 100);
  const overBudgetCount = budgets.filter((c) => c.spent > c.budget).length;

  function handleUpdate(id: string, newBudget: number) {
    setBudgets((prev) =>
      prev.map((c) => (c.id === id ? { ...c, budget: newBudget } : c))
    );
  }

  return (
    <AppLayout pageTitle="Budget Planner">
      <div className="max-w-[1280px] mx-auto">
        {/* Page Header */}
        <Reveal>
          <div className="mb-8">
            <h1 className="text-[var(--color-on-surface)] text-3xl font-bold tracking-tight">
              {t("budget.heading")}
            </h1>
            <p className="mt-1 text-[var(--color-on-surface-variant)] text-base">
              {t("budget.subheading")}
            </p>
          </div>
        </Reveal>

        {/* Summary Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {/* Total Budget */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#e0e7ff] flex items-center justify-center">
                <DollarSign className="h-4.5 w-4.5 text-[var(--color-primary)]" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                Total Budget
              </p>
            </div>
            <p className="text-2xl font-bold tabular-nums text-[var(--color-on-surface)]">
              {formatCurrency(totalBudget)}
            </p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">Monthly allocation</p>
          </motion.div>

          {/* Total Spent */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#fee2e2] flex items-center justify-center">
                <TrendingUp className="h-4.5 w-4.5 text-[#ef4444]" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                Total Spent
              </p>
            </div>
            <p className="text-2xl font-bold tabular-nums text-[var(--color-on-surface)]">
              {formatCurrency(totalSpent)}
            </p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
              {Math.round(overallPct)}% of budget used
            </p>
          </motion.div>

          {/* Remaining */}
          <motion.div
            variants={fadeInUp}
            className={cn(
              "rounded-2xl border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]",
              totalRemaining < 0
                ? "bg-[#fff5f5] border-[#fecaca]"
                : "bg-white border-[var(--color-outline-variant)]"
            )}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  totalRemaining < 0 ? "bg-[#fee2e2]" : "bg-[#d1fae5]"
                )}
              >
                {totalRemaining < 0 ? (
                  <AlertTriangle className="h-4.5 w-4.5 text-[#ef4444]" />
                ) : (
                  <Check className="h-4.5 w-4.5 text-[#22c55e]" />
                )}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                Remaining
              </p>
            </div>
            <p
              className={cn(
                "text-2xl font-bold tabular-nums",
                totalRemaining < 0 ? "text-[#ef4444]" : "text-[#22c55e]"
              )}
            >
              {totalRemaining < 0 ? "-" : ""}{formatCurrency(Math.abs(totalRemaining))}
            </p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
              {overBudgetCount > 0
                ? `${overBudgetCount} ${overBudgetCount === 1 ? "category" : "categories"} over budget`
                : "All categories on track"}
            </p>
          </motion.div>
        </motion.div>

        {/* Overall progress */}
        <Reveal>
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-[var(--color-on-surface)]">Overall Monthly Progress</p>
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: getProgressColor(overallPct) }}
              >
                {Math.round(overallPct)}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-[var(--color-surface-container-low)] overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", getProgressBg(overallPct))}
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[var(--color-on-surface-variant)]">
                {formatCurrency(totalSpent)} spent
              </span>
              <span className="text-xs text-[var(--color-on-surface-variant)]">
                {formatCurrency(totalBudget)} budget
              </span>
            </div>
          </div>
        </Reveal>

        {/* Category Budget Cards */}
        <Reveal>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">
              Category Budgets
            </h2>
            <button
              className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </button>
          </div>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {budgets.map((category) => (
            <BudgetCard
              key={category.id}
              category={category}
              onUpdate={handleUpdate}
            />
          ))}
        </motion.div>
      </div>
    </AppLayout>
  );
}
