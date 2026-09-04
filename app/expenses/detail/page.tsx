"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Edit, Trash2, Upload, Tag, Calendar, FileText, DollarSign, X, AlertTriangle } from 'lucide-react';
import AppLayout from "@/components/AppLayout";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { modalOverlay, modalContent } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_EXPENSES: Record<string, {
  id: string;
  amount: number;
  category: string;
  categoryColor: string;
  categoryBg: string;
  date: string;
  description: string;
  receipt: string | null;
  merchant: string;
}> = {
  "10": {
    id: "10",
    amount: 1800.0,
    category: "Housing",
    categoryColor: "#4f46e5",
    categoryBg: "#ede9fe",
    date: "Oct 09, 2023",
    description: "Monthly rent payment for October 2023",
    receipt: null,
    merchant: "Rent Payment",
  },
  "1": {
    id: "1",
    amount: 144.0,
    category: "Software",
    categoryColor: "#3730a3",
    categoryBg: "#e0e7ff",
    date: "Oct 24, 2023",
    description: "Annual Figma subscription renewal for design team",
    receipt: null,
    merchant: "Figma Subscriptions",
  },
  "2": {
    id: "2",
    amount: 650.0,
    category: "Travel",
    categoryColor: "#f97316",
    categoryBg: "#fff7ed",
    date: "Oct 23, 2023",
    description: "Round-trip flight to San Francisco HQ for Q4 planning",
    receipt: null,
    merchant: "Delta Airlines",
  },
};

const DEFAULT_EXPENSE = MOCK_EXPENSES["10"];

// ─── Field Row Component ──────────────────────────────────────────────────────

function FieldRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[var(--color-outline-variant)] last:border-0">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1">
          {label}
        </p>
        <div className="text-sm text-[var(--color-on-surface)] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteModal({
  onCancel,
  onConfirm,
  merchant,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  merchant: string;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      variants={modalOverlay}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[var(--color-outline-variant)] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] p-6"
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>

        <h2 className="text-lg font-bold text-[var(--color-on-surface)] mb-1">
          Delete Expense
        </h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
          Are you sure you want to delete <span className="font-semibold text-[var(--color-on-surface)]">{merchant}</span>? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-[var(--color-outline-variant)] bg-white text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-lg bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Inner Page (uses useSearchParams) ───────────────────────────────────────

function ExpenseDetailInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "10";
  const expense = MOCK_EXPENSES[id] ?? DEFAULT_EXPENSE;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function handleDelete() {
    setShowDeleteModal(false);
    setDeleted(true);
  }

  if (deleted) {
    return (
      <AppLayout pageTitle="Expense Detail">
        <div className="max-w-lg mx-auto mt-24 text-center">
          <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-green-50 border border-green-100">
            <Trash2 className="h-7 w-7 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">Expense Deleted</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
            The expense has been permanently removed.
          </p>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Expense Detail">
      <div className="max-w-[860px] mx-auto">
        {/* Back link */}
        <Reveal>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main detail card */}
          <Reveal className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] overflow-hidden">
              {/* Card header */}
              <div className="px-6 py-5 border-b border-[var(--color-outline-variant)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: expense.categoryBg }}
                  >
                    <DollarSign className="h-6 w-6" style={{ color: expense.categoryColor }} />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-[var(--color-on-surface)] leading-tight">
                      {expense.merchant}
                    </h1>
                    <span
                      className="inline-flex items-center gap-1 mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{
                        backgroundColor: expense.categoryBg,
                        color: expense.categoryColor,
                      }}
                    >
                      <Tag className="h-3 w-3" />
                      {expense.category}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/add-edit-expense?id=${expense.id}`}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-on-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-200"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="px-6">
                <FieldRow icon={<DollarSign className="h-4 w-4" />} label="Amount">
                  <span className="text-2xl font-bold text-red-500 tabular-nums">
                    -{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(expense.amount)}
                  </span>
                </FieldRow>

                <FieldRow icon={<Calendar className="h-4 w-4" />} label="Date">
                  {expense.date}
                </FieldRow>

                <FieldRow icon={<Tag className="h-4 w-4" />} label="Category">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: expense.categoryBg,
                      color: expense.categoryColor,
                    }}
                  >
                    {expense.category}
                  </span>
                </FieldRow>

                <FieldRow icon={<FileText className="h-4 w-4" />} label="Description">
                  {expense.description || <span className="italic text-[var(--color-on-surface-variant)]">No description provided.</span>}
                </FieldRow>

                <FieldRow icon={<Upload className="h-4 w-4" />} label="Receipt">
                  {expense.receipt ? (
                    <a
                      href={expense.receipt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[var(--color-primary)] hover:underline font-medium"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      View Receipt
                    </a>
                  ) : (
                    <span className="italic text-[var(--color-on-surface-variant)]">No receipt attached.</span>
                  )}
                </FieldRow>
              </div>
            </div>
          </Reveal>

          {/* Sidebar summary card */}
          <Reveal delay={0.1}>
            <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] p-6 flex flex-col gap-5">
              <h2 className="text-sm font-semibold text-[var(--color-on-surface)] uppercase tracking-widest">
                Summary
              </h2>

              {/* Amount highlight */}
              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-center">
                <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-red-500 tabular-nums">
                  -{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(expense.amount)}
                </p>
              </div>

              {/* Meta */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-on-surface-variant)]">Category</span>
                  <span
                    className="font-semibold rounded-full px-2.5 py-0.5 text-xs"
                    style={{ backgroundColor: expense.categoryBg, color: expense.categoryColor }}
                  >
                    {expense.category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-on-surface-variant)]">Date</span>
                  <span className="font-medium text-[var(--color-on-surface)]">{expense.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-on-surface-variant)]">Receipt</span>
                  <span className="font-medium text-[var(--color-on-surface)]">
                    {expense.receipt ? "Attached" : "None"}
                  </span>
                </div>
              </div>

              {/* Quick actions */}
              <div className="pt-2 border-t border-[var(--color-outline-variant)] flex flex-col gap-2">
                <Link
                  href={`/add-edit-expense?id=${expense.id}`}
                  className="flex items-center justify-center gap-2 h-10 rounded-lg bg-[var(--color-primary)] text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Edit className="h-4 w-4" />
                  Edit Expense
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center justify-center gap-2 h-10 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Expense
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteModal
            merchant={expense.merchant}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

// ─── Page Export (wrapped in Suspense for useSearchParams) ────────────────────

export default function ExpenseDetailPage() {
  return (
    <Suspense
      fallback={
        <AppLayout pageTitle="Expense Detail">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
          </div>
        </AppLayout>
      }
    >
      <ExpenseDetailInner />
    </Suspense>
  );
}
