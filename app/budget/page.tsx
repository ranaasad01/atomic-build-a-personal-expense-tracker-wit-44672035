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
            <p className="font-semibold text-[var(--color-on-surface)] text-sm leading-tight">
              {category.name}
            </p>
            {isOverBudget && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#ef4444] mt-0.5">
                <AlertTriangle className="h-3 w-3" />
                Over budget
              </span>
            )}
          </div>
        </div>

        {/* Edit / Save / Cancel */}
        {editing ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleSave}
              className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              aria-label="Save budget"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleCancel}
              className="w-7 h-7 rounded-lg border border-[var(--color-outline-variant)] flex items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
              aria-label="Cancel edit"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setInputValue(String(category.budget)); setEditing(true); }}
            className="text-xs font-medium text-[var(--color-primary)] hover:underline shrink-0 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {/* Spend vs Budget */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wider font-medium mb-0.5">
            Spent
          </p>
          <p className="text-xl font-bold text-[var(--color-on-surface)] tabular-nums leading-none">
            {formatCurrency(category.spent)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wider font-medium mb-0.5">
            Budget
          </p>
          {editing ? (
            <div className="flex items-center gap-1">
              <span className="text-sm text-[var(--color-on-surface-variant)]">$</span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-24 h-8 rounded-lg border border-[var(--color-primary)] bg-white px-2 text-sm font-semibold text-[var(--color-on-surface)] text-right focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] tabular-nums"
                min="1"
              />
            </div>
          ) : (
            <p className="text-xl font-bold text-[var(--color-on-surface-variant)] tabular-nums leading-none">
              {formatCurrency(category.budget)}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-[var(--color-surface-container)] overflow-hidden mb-2">
        <div
          className={cn("h-full rounded-full transition-all duration-500", progressBg)}
          style={{ width: `${Math.min(pct, 100)}%` }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${category.name} budget usage`}
        />
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium" style={{ color: progressColor }}>
          {Math.round(pct)}% used
        </span>
        <span
          className={cn(
            "text-[11px] font-medium",
            isOverBudget ? "text-[#ef4444]" : "text-[var(--color-on-surface-variant)]"
          )}
        >
          {isOverBudget
            ? `${formatCurrency(Math.abs(remaining))} over`
            : `${formatCurrency(remaining)} left`}
        </span>
      </div>
    </motion.div>
  );
}

export default function BudgetPage() {
  const t = useTranslations();
  const [budgets, setBudgets] = useState<BudgetCategory[]>(INITIAL_BUDGETS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");

  const totalBudget = budgets.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = budgets.reduce((sum, c) => sum + c.spent, 0);
  const overBudgetCount = budgets.filter((c) => c.spent > c.budget).length;
  const totalPct = Math.round((totalSpent / totalBudget) * 100);

  function handleUpdateBudget(id: string, newBudget: number) {
    setBudgets((prev) =>
      prev.map((c) => (c.id === id ? { ...c, budget: newBudget } : c))
    );
  }

  function handleAddCategory() {
    if (!newCategoryName.trim() || !newCategoryBudget) return;
    const parsed = parseFloat(newCategoryBudget);
    if (isNaN(parsed) || parsed <= 0) return;
    const newCat: BudgetCategory = {
      id: `custom-${Date.now()}`,
      name: newCategoryName.trim(),
      icon: "more_horiz",
      color: "#94a3b8",
      spent: 0,
      budget: parsed,
    };
    setBudgets((prev) => [...prev, newCat]);
    setNewCategoryName("");
    setNewCategoryBudget("");
    setShowAddModal(false);
  }

  return (
    <AppLayout pageTitle="Budget Planner">
      <div className="max-w-[1200px] mx-auto">
        {/* Page Header */}
        <Reveal>
          <div className="mb-8">
            <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-on-surface)] leading-tight">
              Budget Planner
            </h1>
            <p className="mt-1 text-[var(--color-on-surface-variant)] text-base">
              Set monthly limits per category and track your progress.
            </p>
          </div>
        </Reveal>

        {/* Summary stat cards */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Budget */}
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#e0e7ff] flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-[var(--color-primary)]" />
                </div>
                <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
                  Total Budget
                </p>
              </div>
              <p className="text-3xl font-bold text-[var(--color-on-surface)] tabular-nums tracking-tight">
                {formatCurrency(totalBudget)}
              </p>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">Monthly limit across all categories</p>
            </div>

            {/* Total Spent */}
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: totalSpent > totalBudget ? "#fee2e2" : "#dcfce7" }}
                >
                  <TrendingUp
                    className="h-4 w-4"
                    style={{ color: totalSpent > totalBudget ? "#ef4444" : "#22c55e" }}
                  />
                </div>
                <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
                  Total Spent
                </p>
              </div>
              <p
                className="text-3xl font-bold tabular-nums tracking-tight"
                style={{ color: totalSpent > totalBudget ? "#ef4444" : "#22c55e" }}
              >
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                {totalPct}% of total budget used
              </p>
            </div>

            {/* Remaining */}
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#dcfce7] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] text-[#22c55e]" aria-hidden="true">savings</span>
                </div>
                <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
                  Remaining
                </p>
              </div>
              <p className="text-3xl font-bold text-[var(--color-on-surface)] tabular-nums tracking-tight">
                {formatCurrency(Math.max(totalBudget - totalSpent, 0))}
              </p>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">Left to spend this month</p>
            </div>

            {/* Over Budget */}
            <div
              className={cn(
                "rounded-2xl border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]",
                overBudgetCount > 0
                  ? "bg-[#fff5f5] border-[#fecaca]"
                  : "bg-white border-[var(--color-outline-variant)]"
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: overBudgetCount > 0 ? "#fee2e2" : "#dcfce7" }}
                >
                  <AlertTriangle
                    className="h-4 w-4"
                    style={{ color: overBudgetCount > 0 ? "#ef4444" : "#22c55e" }}
                  />
                </div>
                <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
                  Over Budget
                </p>
              </div>
              <p
                className="text-3xl font-bold tabular-nums tracking-tight"
                style={{ color: overBudgetCount > 0 ? "#ef4444" : "#22c55e" }}
              >
                {overBudgetCount}
              </p>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                {overBudgetCount === 0 ? "All categories on track" : `${overBudgetCount} categor${overBudgetCount === 1 ? "y" : "ies"} exceeded`}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Overall progress bar */}
        <Reveal delay={0.1}>
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-[var(--color-on-surface)]">Overall Monthly Budget</p>
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: getProgressColor(totalPct) }}
              >
                {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-[var(--color-surface-container)] overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", getProgressBg(totalPct))}
                style={{ width: `${Math.min(totalPct, 100)}%` }}
                role="progressbar"
                aria-valuenow={totalPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Overall budget usage"
              />
            </div>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-2">
              {totalPct}% of your monthly budget used
            </p>
          </div>
        </Reveal>

        {/* Category Budget Cards Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">Category Budgets</h2>
            <span className="text-sm text-[var(--color-on-surface-variant)]">
              {budgets.length} categories
            </span>
          </div>

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
                onUpdate={handleUpdateBudget}
              />
            ))}
          </motion.div>
        </div>

        {/* Add Category Budget button */}
        <Reveal delay={0.15}>
          <div className="flex justify-center mt-6 mb-8">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-outline-variant)] bg-white px-6 py-3.5 text-sm font-medium text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)] transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Category Budget
            </button>
          </div>
        </Reveal>

        {/* Tips section */}
        <Reveal delay={0.2}>
          <div className="bg-gradient-to-br from-[var(--color-surface-container-low)] to-[var(--color-surface-container)] rounded-2xl border border-[var(--color-outline-variant)] p-6">
            <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-3">Budget Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "lightbulb", tip: "The 50/30/20 rule: 50% needs, 30% wants, 20% savings.", color: "#f59e0b" },
                { icon: "trending_down", tip: "Review over-budget categories weekly to catch patterns early.", color: "#ef4444" },
                { icon: "check_circle", tip: "Adjust budgets monthly based on your actual spending habits.", color: "#22c55e" },
              ].map((item) => (
                <div key={item.icon} className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-[20px] shrink-0 mt-0.5"
                    style={{ color: item.color }}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-[var(--color-on-surface)]">Add Category Budget</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Fitness, Education"
                  className="w-full h-11 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-1.5">
                  Monthly Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-on-surface-variant)]">$</span>
                  <input
                    type="number"
                    value={newCategoryBudget}
                    onChange={(e) => setNewCategoryBudget(e.target.value)}
                    placeholder="0"
                    min="1"
                    className="w-full h-11 rounded-lg border border-[var(--color-outline-variant)] bg-white pl-7 pr-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-11 rounded-xl border border-[var(--color-outline-variant)] text-sm font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || !newCategoryBudget}
                className="flex-1 h-11 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Budget
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
}
