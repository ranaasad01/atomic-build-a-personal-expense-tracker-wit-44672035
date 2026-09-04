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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[var(--color-outline-variant)] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] p-6"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-bold text-[var(--color-on-surface)] mb-5">
          {category ? t("categories.modal.editTitle") : t("categories.modal.addTitle")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1.5">
              {t("categories.modal.nameLabel")}
            </label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder={t("categories.modal.namePlaceholder")}
              className="w-full h-11 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
            />
            {error && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-error)]">
                <AlertCircle className="h-3.5 w-3.5" />{error}
              </p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1.5">
              {t("categories.modal.budgetLabel")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={t("categories.modal.budgetPlaceholder")}
              className="w-full h-11 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-2">
              {t("categories.modal.colorLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-all duration-150 flex items-center justify-center"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "var(--color-on-surface)" : "transparent",
                  }}
                  aria-label={`Color ${c}`}
                >
                  {color === c && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-2">
              {t("categories.modal.iconLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={cn(
                    "w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-150",
                    icon === ic
                      ? "border-[var(--color-primary)] bg-[var(--color-surface-container)] text-[var(--color-primary)]"
                      : "border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  )}
                  aria-label={ic}
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
              className="flex-1 h-11 rounded-lg border border-[var(--color-outline-variant)] text-sm font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-all duration-200"
            >
              {t("categories.modal.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-container)] transition-all duration-200"
            >
              {t("categories.modal.save")}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function DeleteModal({ name, onCancel, onConfirm }: { name: string; onCancel: () => void; onConfirm: () => void }) {
  const t = useTranslations();
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <motion.div
        className="relative z-10 w-full max-w-sm rounded-2xl bg-white border border-[var(--color-outline-variant)] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] p-6"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-base font-bold text-[var(--color-on-surface)] mb-1">
          {t("categories.deleteModal.title")}
        </h3>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-5">
          {t("categories.deleteModal.body", { name })}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-[var(--color-outline-variant)] text-sm font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-all duration-200"
          >
            {t("categories.deleteModal.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-lg bg-[var(--color-error)] text-white text-sm font-semibold hover:opacity-90 transition-all duration-200"
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CategoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const totalSpent = useMemo(() => categories.reduce((s, c) => s + c.totalSpent, 0), [categories]);
  const totalBudget = useMemo(() => categories.reduce((s, c) => s + (c.budget ?? 0), 0), [categories]);

  function handleOpenAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function handleOpenEdit(cat: CategoryItem) {
    setEditTarget(cat);
    setModalOpen(true);
  }

  function handleSave(data: Omit<CategoryItem, "id" | "totalSpent" | "transactionCount" | "isDefault">) {
    if (editTarget) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editTarget.id ? { ...c, ...data } : c))
      );
    } else {
      const newCat: CategoryItem = {
        id: String(Date.now()),
        ...data,
        totalSpent: 0,
        transactionCount: 0,
        isDefault: false,
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setModalOpen(false);
    setEditTarget(null);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <AppLayout pageTitle={t("categories.pageTitle")}>
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <Reveal>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)]">
                {t("categories.heading")}
              </h1>
              <p className="mt-1 text-[var(--color-on-surface-variant)] text-base">
                {t("categories.subheading")}
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-container)] transition-all duration-200 shrink-0"
            >
              <Plus className="h-4 w-4" />
              {t("categories.addButton")}
            </button>
          </div>
        </Reveal>

        {/* Summary stat cards */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-2">
                {t("categories.stats.totalCategories")}
              </p>
              <p className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight">{categories.length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-2">
                {t("categories.stats.totalSpent")}
              </p>
              <p className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight tabular-nums">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-2">
                {t("categories.stats.totalBudget")}
              </p>
              <p className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight tabular-nums">
                {formatCurrency(totalBudget)}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Search */}
        <Reveal>
          <div className="mb-6 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-on-surface-variant)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("categories.searchPlaceholder")}
              className="w-full h-10 rounded-lg border border-[var(--color-outline-variant)] bg-white pl-9 pr-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
            />
          </div>
        </Reveal>

        {/* Category Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
        >
          {filtered.map((cat) => {
            const { color: statusColor, pct } = getBudgetStatus(cat.totalSpent, cat.budget);
            const isOverBudget = cat.budget !== null && cat.totalSpent > cat.budget;

            return (
              <motion.div
                key={cat.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                }}
                className={cn(
                  "bg-white rounded-2xl border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_2px_4px_-1px_rgba(0,0,0,0.04)] group",
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
                      style={{ backgroundColor: cat.color + "18" }}
                    >
                      <span style={{ color: cat.color }}>{ICON_MAP[cat.icon]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-on-surface)] text-sm leading-tight">{cat.name}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                        {cat.transactionCount} {t("categories.card.transactions")}
                      </p>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)] transition-colors"
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    {!cat.isDefault && (
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:bg-red-50 hover:text-red-500 transition-colors"
                        aria-label={`Delete ${cat.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Spend amount */}
                <div className="mb-3">
                  <p className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight tabular-nums">
                    {formatCurrency(cat.totalSpent)}
                  </p>
                  {cat.budget && (
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                      {t("categories.card.of")} {formatCurrency(cat.budget)} {t("categories.card.budget")}
                    </p>
                  )}
                </div>

                {/* Progress bar */}
                {cat.budget ? (
                  <div>
                    <div className="h-1.5 w-full rounded-full bg-[var(--color-surface-container-high)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: statusColor }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs" style={{ color: statusColor }}>
                        {pct.toFixed(0)}% {t("categories.card.used")}
                      </span>
                      {isOverBudget && (
                        <span className="text-xs font-semibold text-[var(--color-error)]">
                          {t("categories.card.overBudget")}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--color-on-surface-variant)] italic">
                    {t("categories.card.noBudget")}
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container-low)] flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-[var(--color-on-surface-variant)]" />
            </div>
            <p className="text-base font-semibold text-[var(--color-on-surface)]">{t("categories.empty.title")}</p>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{t("categories.empty.body")}</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && (
          <CategoryModal
            key="cat-modal"
            category={editTarget}
            onClose={() => { setModalOpen(false); setEditTarget(null); }}
            onSave={handleSave}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            key="del-modal"
            name={deleteTarget.name}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
