"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, ReceiptText, SlidersHorizontal, ChevronDown, Pencil, Trash2, ChevronLeft, ChevronRight, X, AlertCircle, Plus } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  date: string;
  description: string;
  subtitle: string;
  category: string;
  amount: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ALL_TRANSACTIONS: Transaction[] = [
  { id: "1",  date: "Oct 24, 2023", description: "Figma Subscriptions",   subtitle: "Design Tools",         category: "Software",        amount: -144.00  },
  { id: "2",  date: "Oct 23, 2023", description: "Delta Airlines",        subtitle: "Flight to SF HQ",      category: "Travel",          amount: -650.00  },
  { id: "3",  date: "Oct 21, 2023", description: "AWS Services",          subtitle: "Cloud Hosting Q3",     category: "Software",        amount: -1205.50 },
  { id: "4",  date: "Oct 19, 2023", description: "Staples",               subtitle: "Printer Ink & Paper",  category: "Office Supplies", amount: -85.20   },
  { id: "5",  date: "Oct 15, 2023", description: "Client Refund",         subtitle: "Acme Corp Project",    category: "Income",          amount: +450.00  },
  { id: "6",  date: "Oct 14, 2023", description: "Whole Foods Market",    subtitle: "Weekly Groceries",     category: "Groceries",       amount: -184.30  },
  { id: "7",  date: "Oct 12, 2023", description: "Starbucks Coffee",      subtitle: "Food & Drink",         category: "Food & Drink",    amount: -5.50    },
  { id: "8",  date: "Oct 11, 2023", description: "Uber Rides",            subtitle: "Office Commute",       category: "Transport",       amount: -24.00   },
  { id: "9",  date: "Oct 10, 2023", description: "Netflix",               subtitle: "Monthly Subscription", category: "Entertainment",   amount: -15.99   },
  { id: "10", date: "Oct 09, 2023", description: "Rent Payment",          subtitle: "October Rent",         category: "Housing",         amount: -1800.00 },
  { id: "11", date: "Oct 08, 2023", description: "Pharmacy",              subtitle: "Prescription Meds",    category: "Healthcare",      amount: -42.75   },
  { id: "12", date: "Oct 07, 2023", description: "Spotify Premium",       subtitle: "Music Subscription",   category: "Entertainment",   amount: -9.99    },
  { id: "13", date: "Oct 06, 2023", description: "Trader Joe's",          subtitle: "Groceries",            category: "Groceries",       amount: -67.40   },
  { id: "14", date: "Oct 05, 2023", description: "Google Workspace",      subtitle: "Business Tools",       category: "Software",        amount: -12.00   },
  { id: "15", date: "Oct 04, 2023", description: "Freelance Income",      subtitle: "Design Project",       category: "Income",          amount: +2200.00 },
  { id: "16", date: "Oct 03, 2023", description: "Shell Gas Station",     subtitle: "Fuel",                 category: "Transport",       amount: -58.20   },
  { id: "17", date: "Oct 02, 2023", description: "Dentist Visit",         subtitle: "Routine Checkup",      category: "Healthcare",      amount: -120.00  },
  { id: "18", date: "Oct 01, 2023", description: "Office Depot",          subtitle: "Stationery",           category: "Office Supplies", amount: -34.60   },
  { id: "19", date: "Sep 30, 2023", description: "Airbnb Stay",           subtitle: "Weekend Trip",         category: "Travel",          amount: -320.00  },
  { id: "20", date: "Sep 29, 2023", description: "Electricity Bill",      subtitle: "September Utilities",  category: "Housing",         amount: -95.00   },
  { id: "21", date: "Sep 28, 2023", description: "Chipotle",              subtitle: "Lunch",                category: "Food & Drink",    amount: -13.75   },
  { id: "22", date: "Sep 27, 2023", description: "Amazon Prime",          subtitle: "Annual Membership",    category: "Entertainment",   amount: -139.00  },
  { id: "23", date: "Sep 26, 2023", description: "Zoom Pro",              subtitle: "Video Conferencing",   category: "Software",        amount: -14.99   },
  { id: "24", date: "Sep 25, 2023", description: "Consulting Fee",        subtitle: "Tech Advisory",        category: "Income",          amount: +800.00  },
  { id: "25", date: "Sep 24, 2023", description: "CVS Pharmacy",          subtitle: "Health Supplies",      category: "Healthcare",      amount: -28.50   },
  { id: "26", date: "Sep 23, 2023", description: "Lyft Rides",            subtitle: "Airport Transfer",     category: "Transport",       amount: -38.00   },
  { id: "27", date: "Sep 22, 2023", description: "Costco",                subtitle: "Bulk Groceries",       category: "Groceries",       amount: -212.80  },
  { id: "28", date: "Sep 21, 2023", description: "Adobe Creative Cloud",  subtitle: "Design Suite",         category: "Software",        amount: -54.99   },
];

const CATEGORIES_LIST = ["All Categories", ...Array.from(new Set(ALL_TRANSACTIONS.map((tx) => tx.category)))];
const DATE_FILTERS = ["This Month", "Last Month", "Last 3 Months", "All Time"];
const SORT_OPTIONS = [
  { label: "Date (Newest)", value: "date-desc" },
  { label: "Date (Oldest)", value: "date-asc" },
  { label: "Amount (High)", value: "amount-desc" },
  { label: "Amount (Low)", value: "amount-asc" },
];

const CATEGORY_BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  "Software":        { bg: "bg-indigo-50",  text: "text-indigo-700"  },
  "Travel":          { bg: "bg-orange-50",  text: "text-orange-700"  },
  "Office Supplies": { bg: "bg-slate-100",  text: "text-slate-700"   },
  "Income":          { bg: "bg-emerald-50", text: "text-emerald-700" },
  "Groceries":       { bg: "bg-violet-50",  text: "text-violet-700"  },
  "Food & Drink":    { bg: "bg-amber-50",   text: "text-amber-700"   },
  "Transport":       { bg: "bg-teal-50",    text: "text-teal-700"    },
  "Entertainment":   { bg: "bg-purple-50",  text: "text-purple-700"  },
  "Housing":         { bg: "bg-blue-50",    text: "text-blue-700"    },
  "Healthcare":      { bg: "bg-pink-50",    text: "text-pink-700"    },
};

const ITEMS_PER_PAGE = 5;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAmount(amount: number): string {
  const abs = Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return amount >= 0 ? "+$" + abs : "-$" + abs;
}

function getBadgeStyle(category: string): { bg: string; text: string } {
  return CATEGORY_BADGE_STYLES[category] ?? { bg: "bg-slate-100", text: "text-slate-600" };
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  description,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  description: string;
}) {
  const t = useTranslations();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--color-outline-variant)] bg-white p-6 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]"
      >
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
          aria-label={t("transactions.dialog.cancel")}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--color-on-surface)]">{t("transactions.dialog.title")}</h3>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">{description}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-[var(--color-outline-variant)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors"
          >
            {t("transactions.dialog.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
          >
            {t("transactions.dialog.confirm")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function Dropdown({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors whitespace-nowrap"
      >
        {value}
        <ChevronDown className="h-4 w-4 text-[var(--color-on-surface-variant)]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-30 mt-1 min-w-[160px] rounded-xl border border-[var(--color-outline-variant)] bg-white py-1 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08)]"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--color-surface-container-low)]",
                  value === opt ? "font-semibold text-[var(--color-primary)]" : "text-[var(--color-on-surface)]"
                )}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sort Dropdown ────────────────────────────────────────────────────────────

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const current = SORT_OPTIONS.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors whitespace-nowrap"
      >
        <span className="text-[var(--color-on-surface-variant)] font-normal">{t("transactions.filter.sortBy")}</span>
        <span className="text-[var(--color-primary)] font-semibold">{current?.label}</span>
        <ChevronDown className="h-4 w-4 text-[var(--color-on-surface-variant)]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-30 mt-1 min-w-[180px] rounded-xl border border-[var(--color-outline-variant)] bg-white py-1 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08)]"
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--color-surface-container-low)]",
                  value === opt.value ? "font-semibold text-[var(--color-primary)]" : "text-[var(--color-on-surface)]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const t = useTranslations();

  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [dateFilter, setDateFilter] = useState("This Month");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(ALL_TRANSACTIONS);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (categoryFilter !== "All Categories") {
      list = list.filter((tx) => tx.category === categoryFilter);
    }
    list.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date-asc")  return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "amount-desc") return Math.abs(b.amount) - Math.abs(a.amount);
      if (sortBy === "amount-asc")  return Math.abs(a.amount) - Math.abs(b.amount);
      return 0;
    });
    return list;
  }, [transactions, categoryFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleCategoryChange = useCallback((v: string) => { setCategoryFilter(v); setCurrentPage(1); }, []);
  const handleDateChange     = useCallback((v: string) => { setDateFilter(v);     setCurrentPage(1); }, []);
  const handleSortChange     = useCallback((v: string) => { setSortBy(v);         setCurrentPage(1); }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    setTransactions((prev) => prev.filter((tx) => tx.id !== deleteTarget.id));
    setDeleteTarget(null);
  }, [deleteTarget]);

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safePage]);

  const totalSpent = useMemo(
    () => transactions.filter((tx) => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0),
    [transactions]
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-8 md:px-8">
      {/* Confirm Dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            open={!!deleteTarget}
            description={t("transactions.dialog.body", { name: deleteTarget.description })}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Page Header */}
      <Reveal>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)]">
              {t("transactions.heading")}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
              {t("transactions.subheading")}
            </p>
          </div>
          <Link
            href="/expenses/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-container)] transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            {t("transactions.addBtn")}
          </Link>
        </div>
      </Reveal>

      {/* Stat Cards */}
      <Reveal delay={0.05}>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Total Spent */}
          <div className="rounded-2xl border border-[var(--color-outline-variant)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                  <span className="text-[var(--color-primary)]">
                    <ReceiptText className="inline h-4 w-4" />
                  </span>
                  {t("transactions.stat.totalSpentLabel")}
                </p>
                <p className="mt-3 text-4xl font-bold tracking-tight text-[var(--color-on-surface)]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {"$" + totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="mt-2 flex items-center gap-1 text-sm text-red-500 font-medium">
                  <TrendingUp className="h-4 w-4" />
                  {t("transactions.stat.totalSpentTrend")}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-container-low)]">
                <TrendingUp className="h-5 w-5 text-[var(--color-primary)]" />
              </div>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="rounded-2xl border border-[var(--color-outline-variant)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                  <span className="text-[var(--color-secondary)]">
                    <ReceiptText className="inline h-4 w-4" />
                  </span>
                  {t("transactions.stat.totalTxLabel")}
                </p>
                <p className="mt-3 text-4xl font-bold tracking-tight text-[var(--color-on-surface)]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {transactions.length}
                </p>
                <p className="mt-2 flex items-center gap-1 text-sm text-[var(--color-secondary)] font-medium">
                  <TrendingDown className="h-4 w-4" />
                  {t("transactions.stat.totalTxTrend")}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                <ReceiptText className="h-5 w-5 text-[var(--color-secondary)]" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Filter Bar + Table */}
      <Reveal delay={0.1}>
        <div className="rounded-2xl border border-[var(--color-outline-variant)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-3 border-b border-[var(--color-outline-variant)] px-5 py-4">
            <Dropdown value={categoryFilter} options={CATEGORIES_LIST} onChange={handleCategoryChange} />
            <Dropdown value={dateFilter}     options={DATE_FILTERS}    onChange={handleDateChange}     />
            <button
              className="flex items-center gap-2 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors"
              aria-label={t("transactions.filter.filterBtn")}
            >
              <SlidersHorizontal className="h-4 w-4 text-[var(--color-on-surface-variant)]" />
            </button>
            <div className="ml-auto">
              <SortDropdown value={sortBy} onChange={handleSortChange} />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-container-low)]">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                    {t("transactions.table.date")}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                    {t("transactions.table.description")}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                    {t("transactions.table.category")}
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                    {t("transactions.table.amount")}
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                    {t("transactions.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-sm text-[var(--color-on-surface-variant)]">
                        {t("transactions.table.empty")}
                      </td>
                    </tr>
                  ) : (
                    paginated.map((tx, i) => {
                      const badge = getBadgeStyle(tx.category);
                      const isPositive = tx.amount >= 0;
                      return (
                        <motion.tr
                          key={tx.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2, delay: i * 0.03 }}
                          className="group border-t border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
                        >
                          <td className="px-5 py-4 text-sm text-[var(--color-on-surface-variant)] whitespace-nowrap align-middle">
                            {tx.date}
                          </td>
                          <td className="px-5 py-4 align-middle">
                            <p className="text-sm font-semibold text-[var(--color-on-surface)]">{tx.description}</p>
                            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{tx.subtitle}</p>
                          </td>
                          <td className="px-5 py-4 align-middle">
                            <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", badge.bg, badge.text)}>
                              {tx.category}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right align-middle">
                            <span className={cn("text-sm font-bold tabular-nums", isPositive ? "text-[var(--color-secondary)]" : "text-red-500")}>
                              {formatAmount(tx.amount)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right align-middle">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link
                                href={"/expenses/new?id=" + tx.id}
                                className="rounded-lg p-1.5 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-primary)] transition-colors"
                                aria-label={t("transactions.table.editLabel")}
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => setDeleteTarget(tx)}
                                className="rounded-lg p-1.5 text-[var(--color-on-surface-variant)] hover:bg-red-50 hover:text-red-500 transition-colors"
                                aria-label={t("transactions.table.deleteLabel")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--color-outline-variant)] px-5 py-4 sm:flex-row">
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              {t("transactions.pagination.showing", {
                from: filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1,
                to: Math.min(safePage * ITEMS_PER_PAGE, filtered.length),
                total: filtered.length,
              })}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label={t("transactions.pagination.prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {pageNumbers.map((pg, idx) =>
                pg === "..." ? (
                  <span key={"ellipsis-" + idx} className="flex h-8 w-8 items-center justify-center text-sm text-[var(--color-on-surface-variant)]">
                    ...
                  </span>
                ) : (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg as number)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                      safePage === pg
                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                        : "border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)]"
                    )}
                  >
                    {pg}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label={t("transactions.pagination.next")}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
