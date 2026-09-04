"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, Home, ShoppingCart, Car, Monitor, Plane, Heart, Tv, MoreHorizontal, UtensilsCrossed, X, Check, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import AppLayout from "@/components/AppLayout";

const ICON_MAP: Record<string, React.ReactNode> = {
  Home: <Home className="h-5 w-5" />,
  UtensilsCrossed: <UtensilsCrossed className="h-5 w-5" />,
  Car: <Car className="h-5 w-5" />,
  ShoppingCart: <ShoppingCart className="h-5 w-5" />,
  Monitor: <Monitor className="h-5 w-5" />,
  Plane: <Plane className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
  Tv: <Tv className="h-5 w-5" />,
  MoreHorizontal: <MoreHorizontal className="h-5 w-5" />,
};

interface CategoryItem {
  id: string;
  name: string;
  color: string;
  icon: string;
  totalSpent: number;
  transactionCount: number;
  budget: number | null;
  isDefault: boolean;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: "1", name: "Housing", color: "#4f46e5", icon: "Home", totalSpent: 1500, transactionCount: 3, budget: 2000, isDefault: true },
  { id: "2", name: "Food & Drink", color: "#f59e0b", icon: "UtensilsCrossed", totalSpent: 1245, transactionCount: 28, budget: 1500, isDefault: true },
  { id: "3", name: "Transport", color: "#10b981", icon: "Car", totalSpent: 450, transactionCount: 12, budget: 600, isDefault: true },
  { id: "4", name: "Groceries", color: "#6366f1", icon: "ShoppingCart", totalSpent: 380, transactionCount: 9, budget: 500, isDefault: true },
  { id: "5", name: "Software & Subscriptions", color: "#3730a3", icon: "Monitor", totalSpent: 288, transactionCount: 5, budget: 300, isDefault: true },
  { id: "6", name: "Travel", color: "#f97316", icon: "Plane", totalSpent: 650, transactionCount: 2, budget: 1000, isDefault: true },
  { id: "7", name: "Healthcare", color: "#ef4444", icon: "Heart", totalSpent: 120, transactionCount: 4, budget: 400, isDefault: true },
  { id: "8", name: "Entertainment", color: "#94a3b8", icon: "Tv", totalSpent: 200, transactionCount: 7, budget: 250, isDefault: true },
  { id: "9", name: "Other", color: "#94a3b8", icon: "MoreHorizontal", totalSpent: 95, transactionCount: 6, budget: null, isDefault: true },
];

const AVAILABLE_ICONS = ["Home", "UtensilsCrossed", "Car", "ShoppingCart", "Monitor", "Plane", "Heart", "Tv", "MoreHorizontal"];
const AVAILABLE_COLORS = [
  "#4f46e5", "#6366f1", "#3730a3", "#10b981", "#22c55e", "#f59e0b",
  "#f97316", "#ef4444", "#94a3b8", "#0ea5e9", "#8b5cf6", "#ec4899",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(amount);
}

function getBudgetStatus(spent: number, budget: number | null): { color: string; pct: number } {
  if (!budget) return { color: "#94a3b8", pct: 0 };
  const pct = Math.min((spent / budget) * 100, 100);
  if (pct >= 100) return { color: "#ef4444", pct };
  if (pct >= 80) return { color: "#f59e0b", pct };
  return { color: "#10b981", pct };
}

interface ModalProps {
  category: CategoryItem | null;
  onClose: () => void;
  onSave: (cat: Omit<CategoryItem, "id" | "totalSpent" | "transactionCount" | "isDefault">) => void;
}

function CategoryModal({ category, onClose, onSave }: ModalProps) {
  const t = useTranslations();
  const [name, setName] = useState(category?.name ?? "");
  const [color, setColor] = useState(category?.color ?? "#4f46e5");
  const [icon, setIcon] = useState(category?.icon ?? "Home");
  const [budget, setBudget] = useState<string>(category?.budget != null ? String(category.budget) : "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError(t("categories.modal.nameRequired")); return; }
    onSave({ name: name.trim(), color, icon, budget: budget ? parseFloat(budget) : null });
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md rounded-2xl bg-white border border-[var(--color-outline-variant)] shadow-[0_20px_60px_-10px_rgba(53,37,205,0.18)] p-6"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[var(--color-on-surface)]">
            {category ? t("categories.modal.editTitle") : t("categories.modal.addTitle")}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-[var(--color-surface-container-low)] transition-colors">
            <X className="h-4 w-4 text-[var(--color-on-surface-variant)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">
              {t("categories.modal.nameLabel")}
            </label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder={t("categories.modal.namePlaceholder")}
              className="w-full h-10 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
            />
            {error && (
              <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-error)]">
                <AlertCircle className="h-3.5 w-3.5" /> {error}
              </p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">
              {t("categories.modal.budgetLabel")}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-on-surface-variant)]">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0.00"
                className="w-full h-10 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] pl-7 pr-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">
              {t("categories.modal.colorLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "var(--color-on-surface)" : "transparent",
                  }}
                >
                  {color === c && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">
              {t("categories.modal.iconLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={cn(
                    "w-9 h-9 rounded-lg border flex items-center justify-center transition-all",
                    icon === ic
                      ? "border-[var(--color-primary)] bg-[var(--color-surface-container)] text-[var(--color-primary)]"
                      : "border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]"
                  )}
                >
                  {ICON_MAP[ic]}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-[var(--color-outline-variant)] text-sm font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-all"
            >
              {t("categories.modal.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-container)] transition-all"
            >
              {category ? t("categories.modal.save") : t("categories.modal.add")}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

interface DeleteModalProps {
  category: CategoryItem;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteModal({ category, onClose, onConfirm }: DeleteModalProps) {
  const t = useTranslations();
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-sm rounded-2xl bg-white border border-[var(--color-outline-variant)] shadow-[0_20px_60px_-10px_rgba(53,37,205,0.18)] p-6"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--color-error-container)] flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-[var(--color-error)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--color-on-surface)]">{t("categories.deleteModal.title")}</h2>
            <p className="text-xs text-[var(--color-on-surface-variant)]">{t("categories.deleteModal.subtitle")}</p>
          </div>
        </div>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-5">
          {t("categories.deleteModal.body", { name: category.name })}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-[var(--color-outline-variant)] text-sm font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-all"
          >
            {t("categories.deleteModal.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-lg bg-[var(--color-error)] text-white text-sm font-semibold hover:opacity-90 transition-all"
          >
            {t("categories.deleteModal.confirm")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CategoriesPage() {
  const t = useTranslations();

  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [search, setSearch] = useState("");
  const [filterOver, setFilterOver] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);

  const totalSpent = useMemo(() => categories.reduce((s, c) => s + c.totalSpent, 0), [categories]);
  const totalBudget = useMemo(() => categories.reduce((s, c) => s + (c.budget ?? 0), 0), [categories]);
  const overBudgetCount = useMemo(
    () => categories.filter((c) => c.budget !== null && c.totalSpent >= c.budget).length,
    [categories]
  );

  const filtered = useMemo(() => {
    let list = categories;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (filterOver) {
      list = list.filter((c) => c.budget !== null && c.totalSpent >= c.budget);
    }
    return list;
  }, [categories, search, filterOver]);

  function handleSave(data: Omit<CategoryItem, "id" | "totalSpent" | "transactionCount" | "isDefault">) {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...data } : c))
      );
      setEditingCategory(null);
    } else {
      const newCat: CategoryItem = {
        id: String(Date.now()),
        ...data,
        totalSpent: 0,
        transactionCount: 0,
        isDefault: false,
      };
      setCategories((prev) => [...prev, newCat]);
      setShowAddModal(false);
    }
  }

  function handleDelete() {
    if (!deletingCategory) return;
    setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
    setDeletingCategory(null);
  }

  return (
    <AppLayout pageTitle="Categories">
      <div className="max-w-[1200px] mx-auto">
        {/* Page Header */}
        <Reveal>
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-on-surface)]">
                {t("categories.heading")}
              </h1>
              <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
                {t("categories.subheading")}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-container)] transition-all duration-200 shrink-0"
            >
              <Plus className="h-4 w-4" />
              {t("categories.addButton")}
            </button>
          </div>
        </Reveal>

        {/* Summary StatCards */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Total Spent */}
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase mb-2">
                {t("categories.stats.totalSpent")}
              </p>
              <p className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight">
                {formatCurrency(totalSpent)}
              </p>
              <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                {t("categories.stats.acrossCategories", { count: categories.length })}
              </p>
            </div>

            {/* Over Budget */}
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase mb-2">
                {t("categories.stats.totalBudget")}
              </p>
              <p className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight">
                {formatCurrency(totalBudget)}
              </p>
              <p className={cn(
                "mt-1 text-xs font-medium",
                overBudgetCount > 0 ? "text-[var(--color-error)]" : "text-[var(--color-secondary)]"
              )}>
                {overBudgetCount > 0
                  ? t("categories.stats.overBudget", { count: overBudgetCount })
                  : t("categories.stats.onTrack")}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Search + Filter */}
        <Reveal>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-on-surface-variant)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("categories.searchPlaceholder")}
                className="w-full h-10 rounded-lg border border-[var(--color-outline-variant)] bg-white pl-9 pr-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
              />
            </div>
            <button
              onClick={() => setFilterOver((v) => !v)}
              className={cn(
                "flex items-center gap-2 h-10 px-4 rounded-lg border text-sm font-medium transition-all",
                filterOver
                  ? "border-[var(--color-error)] bg-[var(--color-error-container)] text-[var(--color-error)]"
                  : "border-[var(--color-outline-variant)] bg-white text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]"
              )}
            >
              <AlertCircle className="h-4 w-4" />
              {t("categories.filterOverBudget")}
            </button>
          </div>
        </Reveal>

        {/* Category Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          <AnimatePresence>
            {filtered.map((cat) => {
              const { color: barColor, pct } = getBudgetStatus(cat.totalSpent, cat.budget);
              return (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col gap-3 group hover:shadow-[0_4px_20px_-4px_rgba(53,37,205,0.12)] transition-shadow duration-200"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: cat.color + "22", color: cat.color }}
                      >
                        {ICON_MAP[cat.icon] ?? <MoreHorizontal className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-on-surface)] leading-tight">{cat.name}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">
                          {cat.transactionCount} {t("categories.card.transactions")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-surface-container-low)] transition-colors"
                        aria-label={`Edit ${cat.name}`}
                      >
                        <Edit className="h-3.5 w-3.5 text-[var(--color-on-surface-variant)]" />
                      </button>
                      {!cat.isDefault && (
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-error-container)] transition-colors"
                          aria-label={`Delete ${cat.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-[var(--color-error)]" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Spend */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xl font-bold text-[var(--color-on-surface)] tracking-tight">
                        {formatCurrency(cat.totalSpent)}
                      </p>
                      {cat.budget && (
                        <p className="text-xs text-[var(--color-on-surface-variant)]">
                          {t("categories.card.of")} {formatCurrency(cat.budget)} {t("categories.card.budget")}
                        </p>
                      )}
                    </div>
                    {cat.budget && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: barColor + "22",
                          color: barColor,
                        }}
                      >
                        {Math.round(pct)}%
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {cat.budget && (
                    <div className="h-1.5 w-full rounded-full bg-[var(--color-surface-container)]">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: barColor }}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-[var(--color-on-surface-variant)]" />
            </div>
            <p className="text-base font-semibold text-[var(--color-on-surface)]">{t("categories.empty.title")}</p>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{t("categories.empty.body")}</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(showAddModal || editingCategory) && (
          <CategoryModal
            category={editingCategory}
            onClose={() => { setShowAddModal(false); setEditingCategory(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingCategory && (
          <DeleteModal
            category={deletingCategory}
            onClose={() => setDeletingCategory(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
