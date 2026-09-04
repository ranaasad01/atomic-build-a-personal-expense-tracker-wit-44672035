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

        <h2 className="text-lg font-bold text-[var(--color-on-surface)] mb-2">
          Delete Expense
        </h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[var(--color-on-surface)]">{merchant}</span>? This
          action cannot be undone and the expense will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl border border-[var(--color-outline-variant)] bg-white text-sm font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition-all duration-200 shadow-sm"
          >
            Confirm Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ExpenseDetailPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "10";

  const expense = MOCK_EXPENSES[id] ?? DEFAULT_EXPENSE;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function handleConfirmDelete() {
    setShowDeleteModal(false);
    setDeleted(true);
  }

  return (
    <AppLayout pageTitle="Expense Detail">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <Reveal>
          <div className="mb-6">
            <Link
              href="/transactions"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to Transactions
            </Link>
          </div>
        </Reveal>

        {deleted ? (
          <Reveal>
            <div className="rounded-2xl border border-[var(--color-outline-variant)] bg-white p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 border border-red-100">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">Expense Deleted</h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                The expense has been permanently removed from your records.
              </p>
              <Link
                href="/transactions"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-container)] transition-all duration-200 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Transactions
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            {/* Amount Hero Card */}
            <Reveal>
              <div className="mb-4 rounded-2xl border border-[var(--color-outline-variant)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] overflow-hidden">
                {/* Top accent strip */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: expense.categoryColor }}
                />

                <div className="p-6 sm:p-8">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1">
                        Expense
                      </p>
                      <h1 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">
                        {expense.merchant}
                      </h1>
                    </div>
                    {/* Category badge */}
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shrink-0"
                      style={{
                        backgroundColor: expense.categoryBg,
                        color: expense.categoryColor,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: expense.categoryColor }}
                      />
                      {expense.category}
                    </span>
                  </div>

                  {/* Large amount */}
                  <div className="mb-8">
                    <p
                      className="tabular-nums text-5xl font-bold tracking-tight leading-none"
                      style={{ color: "#ef4444" }}
                    >
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                      }).format(expense.amount)}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
                      Expense recorded on {expense.date}
                    </p>
                  </div>

                  {/* Field rows */}
                  <div className="divide-y divide-[var(--color-outline-variant)]">
                    <FieldRow
                      icon={<Tag className="h-4 w-4" />}
                      label="Category"
                    >
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: expense.categoryBg,
                          color: expense.categoryColor,
                        }}
                      >
                        {expense.category}
                      </span>
                    </FieldRow>

                    <FieldRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Date"
                    >
                      {expense.date}
                    </FieldRow>

                    <FieldRow
                      icon={<DollarSign className="h-4 w-4" />}
                      label="Amount"
                    >
                      <span
                        className="tabular-nums font-semibold"
                        style={{ color: "#ef4444" }}
                      >
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                        }).format(expense.amount)}
                      </span>
                    </FieldRow>

                    <FieldRow
                      icon={<FileText className="h-4 w-4" />}
                      label="Description"
                    >
                      {expense.description}
                    </FieldRow>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Receipt Section */}
            <Reveal delay={0.08}>
              <div className="mb-6 rounded-2xl border border-[var(--color-outline-variant)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
                <h2 className="text-sm font-semibold text-[var(--color-on-surface)] mb-4">
                  Receipt
                </h2>

                {expense.receipt ? (
                  <img
                    src={expense.receipt}
                    alt="Receipt"
                    className="w-full max-h-64 object-contain rounded-xl border border-[var(--color-outline-variant)]"
                  />
                ) : (
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10",
                      "border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]"
                    )}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                        No receipt attached
                      </p>
                      <p className="text-xs text-[var(--color-outline)] mt-0.5">
                        Edit this expense to upload a receipt image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Action Buttons */}
            <Reveal delay={0.12}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/add-edit-expense?id=${expense.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white hover:bg-[var(--color-primary-container)] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Edit className="h-4 w-4" />
                  Edit Expense
                </Link>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-red-200 bg-white text-sm font-semibold text-red-500 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Expense
                </button>
              </div>
            </Reveal>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteModal
            merchant={expense.merchant}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

export default function ExpenseDetailPage() {
  return (
    <Suspense fallback={null}>
      <ExpenseDetailPageInner />
    </Suspense>
  );
}
