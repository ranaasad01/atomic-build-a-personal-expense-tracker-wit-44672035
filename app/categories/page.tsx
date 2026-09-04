"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, Home, ShoppingCart, Car, Monitor, Plane, Heart, Tv, MoreHorizontal, UtensilsCrossed, X, Check, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

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
    onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md rounded-2xl bg-white border border-[#e5e7eb] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] p-6"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#151c27]">
            {category ? t("categories.modal.editTitle") : t("categories.modal.addTitle")}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#f0f3ff] transition-colors" aria-label={t("categories.modal.close")}>
            <X className="h-4 w-4 text-[#464555]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#151c27] mb-1.5">{t("categories.modal.nameLabel")}</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              placeholder={t("categories.modal.namePlaceholder")}
              className={cn(
                "w-full h-11 px-3 rounded-lg border text-sm text-[#151c27] placeholder:text-[#777587] outline-none transition-colors",
                error ? "border-[#ef4444] focus:ring-2 focus:ring-[#ef4444]/20" : "border-[#c7c4d8] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20"
              )}
            />
            {error && (
              <p className="mt-1 flex items-center gap-1 text-xs text-[#ef4444]">
                <AlertCircle className="h-3 w-3" /> {error}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#151c27] mb-1.5">{t("categories.modal.iconLabel")}</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ICONS.map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center border transition-all",
                    icon === ic
                      ? "border-[#4f46e5] bg-[#f0f3ff] text-[#4f46e5]"
                      : "border-[#e5e7eb] bg-white text-[#464555] hover:border-[#c7c4d8]"
                  )}
                  aria-label={ic}
                >
                  {ICON_MAP[ic]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#151c27] mb-1.5">{t("categories.modal.colorLabel")}</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center"
                  style={{ backgroundColor: c, borderColor: color === c ? "#151c27" : "transparent" }}
                  aria-label={c}
                >
                  {color === c && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#151c27] mb-1.5">{t("categories.modal.budgetLabel")}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#777587]">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder={t("categories.modal.budgetPlaceholder")}
                className="w-full h-11 pl-7 pr-3 rounded-lg border border-[#c7c4d8] text-sm text-[#151c27] placeholder:text-[#777587] outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-lg border border-[#c7c4d8] text-sm font-medium text-[#151c27] hover:bg-[#f0f3ff] transition-colors"
            >
              {t("categories.modal.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-lg bg-[#3525cd] text-sm font-medium text-white hover:bg-[#4f46e5] transition-colors"
            >
              {t("categories.modal.save")}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

interface DeleteConfirmProps {
  category: CategoryItem;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({ category, onClose, onConfirm }: DeleteConfirmProps) {
  const t = useTranslations();
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-sm rounded-2xl bg-white border border-[#e5e7eb] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] p-6"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#ffdad6] flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-[#ba1a1a]" />
          </div>
          <h2 className="text-base font-semibold text-[#151c27]">{t("categories.delete.title")}</h2>
        </div>
        <p className="text-sm text-[#464555] mb-5">
          {t("categories.delete.message", { name: category.name })}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-[#c7c4d8] text-sm font-medium text-[#151c27] hover:bg-[#f0f3ff] transition-colors">
            {t("categories.delete.cancel")}
          </button>
          <button onClick={onConfirm} className="flex-1 h-10 rounded-lg bg-[#ba1a1a] text-sm font-medium text-white hover:bg-[#93000a] transition-colors">
            {t("categories.delete.confirm")}
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);

  const totalSpent = useMemo(() => categories.reduce((s, c) => s + c.totalSpent, 0), [categories]);
  const totalBudget = useMemo(() => categories.reduce((s, c) => s + (c.budget ?? 0), 0), [categories]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return categories.filter(c => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  function handleSave(data: Omit<CategoryItem, "id" | "totalSpent" | "transactionCount" | "isDefault">) {
    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...data } : c));
    } else {
      const newCat: CategoryItem = {
        id: String(Date.now()),
        ...data,
        totalSpent: 0,
        transactionCount: 0,
        isDefault: false,
      };
      setCategories(prev => [...prev, newCat]);
    }
    setEditingCategory(null);
  }

  function handleDelete() {
    if (!deletingCategory) return;
    setCategories(prev => prev.filter(c => c.id !== deletingCategory.id));
    setDeletingCategory(null);
  }

  function openAdd() {
    setEditingCategory(null);
    setModalOpen(true);
  }

  function openEdit(cat: CategoryItem) {
    setEditingCategory(cat);
    setModalOpen(true);
  }

  const summaryStats = (Array.isArray(t.raw("categories.summaryStats")) ? t.raw("categories.summaryStats") : []) as { label: string }[];

  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      <div className="max-w-[1280px] mx-auto px-6 py-8">

        {/* Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#151c27]">{t("categories.heading")}</h1>
              <p className="mt-1 text-sm text-[#464555]">{t("categories.subheading")}</p>
            </div>
            <motion.button
              onClick={openAdd}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-[#3525cd] text-sm font-semibold text-white hover:bg-[#4f46e5] transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              {t("categories.addButton")}
            </motion.button>
          </div>
        </Reveal>

        {/* Summary Cards */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#777587] mb-1">
                {summaryStats[0]?.label ?? t("categories.totalCategories")}
              </p>
              <p className="text-3xl font-bold text-[#151c27]">{categories.length}</p>
              <p className="text-xs text-[#464555] mt-1">{t("categories.activeTracking")}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#777587] mb-1">
                {summaryStats[1]?.label ?? t("categories.totalSpent")}
              </p>
              <p className="text-3xl font-bold text-[#151c27]">{formatCurrency(totalSpent)}</p>
              <p className="text-xs text-[#464555] mt-1">{t("categories.thisMonth")}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#777587] mb-1">
                {summaryStats[2]?.label ?? t("categories.totalBudget")}
              </p>
              <p className="text-3xl font-bold text-[#151c27]">{formatCurrency(totalBudget)}</p>
              <p className="text-xs text-[#464555] mt-1">{t("categories.monthlyLimit")}</p>
            </div>
          </div>
        </Reveal>

        {/* Search */}
        <Reveal delay={0.08}>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#777587]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("categories.searchPlaceholder")}
              className="w-full sm:w-80 h-11 pl-9 pr-4 rounded-lg border border-[#c7c4d8] bg-white text-sm text-[#151c27] placeholder:text-[#777587] outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-colors"
            />
          </div>
        </Reveal>

        {/* Category Grid */}
        <Reveal delay={0.1}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-full bg-[#f0f3ff] flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-[#4f46e5]" />
              </div>
              <p className="text-base font-semibold text-[#151c27]">{t("categories.emptyTitle")}</p>
              <p className="text-sm text-[#464555] mt-1">{t("categories.emptyMessage")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((cat, i) => {
                  const { color: barColor, pct } = getBudgetStatus(cat.totalSpent, cat.budget);
                  return (
                    <motion.div
                      key={cat.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: i * 0.04, ease: "easeOut" }}
                      whileHover={{ y: -2, boxShadow: "0px_8px_24px_-8px_rgba(0,0,0,0.12)" }}
                      className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.03)] group"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          >
                            {ICON_MAP[cat.icon] ?? <MoreHorizontal className="h-5 w-5" />}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-[#151c27] leading-tight">{cat.name}</h3>
                            <p className="text-xs text-[#777587] mt-0.5">
                              {cat.transactionCount} {t("categories.transactions")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(cat)}
                            className="p-1.5 rounded-lg hover:bg-[#f0f3ff] text-[#464555] hover:text-[#4f46e5] transition-colors"
                            aria-label={t("categories.editAriaLabel")}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          {!cat.isDefault && (
                            <button
                              onClick={() => setDeletingCategory(cat)}
                              className="p-1.5 rounded-lg hover:bg-[#ffdad6] text-[#464555] hover:text-[#ba1a1a] transition-colors"
                              aria-label={t("categories.deleteAriaLabel")}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Spent */}
                      <div className="mb-3">
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-xl font-bold text-[#151c27] tabular-nums">{formatCurrency(cat.totalSpent)}</span>
                          {cat.budget && (
                            <span className="text-xs text-[#777587]">
                              {t("categories.of")} {formatCurrency(cat.budget)}
                            </span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {cat.budget ? (
                          <div className="h-1.5 w-full bg-[#e7eefe] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: barColor }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.04 + 0.2 }}
                            />
                          </div>
                        ) : (
                          <div className="h-1.5 w-full bg-[#e7eefe] rounded-full" />
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        {cat.budget ? (
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: barColor + "20",
                              color: barColor,
                            }}
                          >
                            {Math.round(getBudgetStatus(cat.totalSpent, cat.budget).pct)}% {t("categories.used")}
                          </span>
                        ) : (
                          <span className="text-xs text-[#777587]">{t("categories.noBudget")}</span>
                        )}
                        {cat.isDefault && (
                          <span className="text-xs text-[#777587] bg-[#f0f3ff] px-2 py-0.5 rounded-full">
                            {t("categories.default")}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </Reveal>

        {/* Spending Breakdown Table */}
        <Reveal delay={0.12}>
          <div className="mt-10 bg-white rounded-xl border border-[#e5e7eb] shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e7eefe]">
              <h2 className="text-base font-semibold text-[#151c27]">{t("categories.breakdownTitle")}</h2>
              <p className="text-xs text-[#464555] mt-0.5">{t("categories.breakdownSubtitle")}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f0f3ff]">
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#777587]">{t("categories.table.category")}</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#777587]">{t("categories.table.transactions")}</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#777587]">{t("categories.table.spent")}</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#777587]">{t("categories.table.budget")}</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#777587]">{t("categories.table.share")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7eefe]">
                  {categories
                    .slice()
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .map(cat => {
                      const share = totalSpent > 0 ? ((cat.totalSpent / totalSpent) * 100).toFixed(1) : "0.0";
                      const { color: barColor, pct } = getBudgetStatus(cat.totalSpent, cat.budget);
                      return (
                        <tr key={cat.id} className="hover:bg-[#f9f9ff] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                                style={{ backgroundColor: cat.color }}
                              >
                                <span className="scale-75">{ICON_MAP[cat.icon] ?? <MoreHorizontal className="h-4 w-4" />}</span>
                              </div>
                              <span className="font-medium text-[#151c27]">{cat.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-[#464555] tabular-nums">{cat.transactionCount}</td>
                          <td className="px-6 py-4 text-right font-semibold text-[#151c27] tabular-nums">{formatCurrency(cat.totalSpent)}</td>
                          <td className="px-6 py-4 text-right text-[#464555] tabular-nums">
                            {cat.budget ? (
                              <div className="flex flex-col items-end gap-1">
                                <span>{formatCurrency(cat.budget)}</span>
                                <div className="w-20 h-1 bg-[#e7eefe] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                                </div>
                              </div>
                            ) : (
                              <span className="text-[#777587]">{t("categories.table.noBudget")}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-[#151c27] font-medium tabular-nums">{share}%</span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && (
          <CategoryModal
            category={editingCategory}
            onClose={() => { setModalOpen(false); setEditingCategory(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deletingCategory && (
          <DeleteConfirmModal
            category={deletingCategory}
            onClose={() => setDeletingCategory(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}