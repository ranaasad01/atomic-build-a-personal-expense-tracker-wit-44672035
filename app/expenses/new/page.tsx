"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Save, Lock, Upload, X, ChevronDown, AlertCircle } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { fadeInUp, scaleIn } from "@/lib/motion";

const FORM_CATEGORIES = [
  { value: "Housing", label: "Housing" },
  { value: "Food & Drink", label: "Food & Drink" },
  { value: "Transport", label: "Transport" },
  { value: "Software & Subscriptions", label: "Software & Subscriptions" },
  { value: "Travel", label: "Travel" },
  { value: "Groceries", label: "Groceries" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Other", label: "Other" },
];

interface ExpenseFormData {
  amount: string;
  category: string;
  date: string;
  description: string;
  receiptName: string | null;
}

interface FormErrors {
  amount?: string;
  category?: string;
  date?: string;
}

function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function AddEditExpensePageInner() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const expenseId = searchParams.get("id");
  const isEditMode = Boolean(expenseId);

  const [form, setForm] = useState<ExpenseFormData>({
    amount: "",
    category: "",
    date: "",
    description: "",
    receiptName: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const today = getTodayString();
    if (expenseId) {
      try {
        const stored = localStorage.getItem("spendwise_expenses");
        if (stored) {
          const expenses: Array<{
            id: string;
            amount: string;
            category: string;
            date: string;
            description: string;
            receiptName: string | null;
          }> = JSON.parse(stored);
          const found = expenses.find((e) => e.id === expenseId);
          if (found) {
            setForm({
              amount: found.amount ?? "",
              category: found.category ?? "",
              date: found.date ?? today,
              description: found.description ?? "",
              receiptName: found.receiptName ?? null,
            });
            return;
          }
        }
      } catch {
        // ignore parse errors
      }
    }
    setForm((prev) => ({ ...prev, date: today }));
  }, [expenseId]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const amountNum = parseFloat(form.amount);
    if (!form.amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = t("expenseForm.errors.amountRequired");
    }
    if (!form.category) {
      newErrors.category = t("expenseForm.errors.categoryRequired");
    }
    if (!form.date) {
      newErrors.date = t("expenseForm.errors.dateRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      const stored = localStorage.getItem("spendwise_expenses");
      const expenses: Array<{
        id: string;
        amount: string;
        category: string;
        date: string;
        description: string;
        receiptName: string | null;
        created_at: string;
      }> = stored ? JSON.parse(stored) : [];

      if (isEditMode && expenseId) {
        const idx = expenses.findIndex((e) => e.id === expenseId);
        if (idx !== -1) {
          expenses[idx] = {
            ...expenses[idx],
            amount: form.amount,
            category: form.category,
            date: form.date,
            description: form.description,
            receiptName: form.receiptName,
          };
        }
      } else {
        expenses.unshift({
          id: `exp_${Date.now()}`,
          amount: form.amount,
          category: form.category,
          date: form.date,
          description: form.description,
          receiptName: form.receiptName,
          created_at: new Date().toISOString(),
        });
      }
      localStorage.setItem("spendwise_expenses", JSON.stringify(expenses));
    } catch {
      // ignore storage errors
    }
    setIsSaving(false);
    router.push("/transactions");
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, receiptName: file.name }));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, receiptName: file.name }));
    }
  };

  const removeFile = () => {
    setForm((prev) => ({ ...prev, receiptName: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] py-10 px-4">
      <Reveal>
        <div className="max-w-2xl mx-auto">
          {/* Page heading */}
          <div className="text-center mb-8">
            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)]"
            >
              {isEditMode ? t("expenseForm.titleEdit") : t("expenseForm.titleAdd")}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.08 }}
              className="mt-2 flex items-center justify-center gap-1.5 text-sm text-[var(--color-on-surface-variant)]"
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              {t("expenseForm.privateSubtitle")}
            </motion.p>
          </div>

          {/* Form card */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-8"
            style={{
              boxShadow:
                "0px 1px 3px rgba(0,0,0,0.05), 0px 10px 15px -3px rgba(0,0,0,0.03)",
            }}
          >
            {/* Amount */}
            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-sm font-semibold text-[var(--color-on-surface)] mb-2"
              >
                {t("expenseForm.amountLabel")}
              </label>
              <div
                className={cn(
                  "flex items-center border rounded-lg overflow-hidden transition-all duration-200",
                  errors.amount
                    ? "border-[var(--color-error)]"
                    : "border-[var(--color-outline-variant)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20"
                )}
              >
                <span className="px-4 py-3 text-lg font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] border-r border-[var(--color-outline-variant)] select-none">
                  $
                </span>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, amount: e.target.value }));
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  className="flex-1 px-4 py-3 text-lg font-medium text-[var(--color-on-surface)] bg-transparent outline-none placeholder:text-[var(--color-outline)]"
                  aria-describedby={errors.amount ? "amount-error" : undefined}
                />
              </div>
              {errors.amount && (
                <p id="amount-error" className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-error)]">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Category + Date row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-[var(--color-on-surface)] mb-2"
                >
                  {t("expenseForm.categoryLabel")}
                </label>
                <div
                  className={cn(
                    "relative border rounded-lg transition-all duration-200",
                    errors.category
                      ? "border-[var(--color-error)]"
                      : "border-[var(--color-outline-variant)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20"
                  )}
                >
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, category: e.target.value }));
                      if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                    }}
                    className="w-full appearance-none px-4 py-3 text-sm text-[var(--color-on-surface)] bg-transparent outline-none pr-10 cursor-pointer"
                    aria-describedby={errors.category ? "category-error" : undefined}
                  >
                    <option value="" disabled>
                      {t("expenseForm.categoryPlaceholder")}
                    </option>
                    {FORM_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-on-surface-variant)] pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
                {errors.category && (
                  <p id="category-error" className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-error)]">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-semibold text-[var(--color-on-surface)] mb-2"
                >
                  {t("expenseForm.dateLabel")}
                </label>
                <div
                  className={cn(
                    "border rounded-lg transition-all duration-200",
                    errors.date
                      ? "border-[var(--color-error)]"
                      : "border-[var(--color-outline-variant)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20"
                  )}
                >
                  <input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, date: e.target.value }));
                      if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                    }}
                    className="w-full px-4 py-3 text-sm text-[var(--color-on-surface)] bg-transparent outline-none cursor-pointer"
                    aria-describedby={errors.date ? "date-error" : undefined}
                  />
                </div>
                {errors.date && (
                  <p id="date-error" className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-error)]">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {errors.date}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-[var(--color-on-surface)] mb-2"
              >
                {t("expenseForm.descriptionLabel")}{" "}
                <span className="font-normal text-[var(--color-on-surface-variant)]">
                  ({t("expenseForm.optional")})
                </span>
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder={t("expenseForm.descriptionPlaceholder")}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-4 py-3 text-sm text-[var(--color-on-surface)] bg-transparent border border-[var(--color-outline-variant)] rounded-lg outline-none resize-none placeholder:text-[var(--color-outline)] transition-all duration-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>

            {/* Receipt / Attachment */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[var(--color-on-surface)] mb-2">
                {t("expenseForm.receiptLabel")}{" "}
                <span className="font-normal text-[var(--color-on-surface-variant)]">
                  ({t("expenseForm.optional")})
                </span>
              </label>

              {form.receiptName ? (
                <div className="flex items-center justify-between px-4 py-3 border border-[var(--color-primary)] rounded-lg bg-[var(--color-surface-container-low)]">
                  <div className="flex items-center gap-2 min-w-0">
                    <Upload className="h-4 w-4 text-[var(--color-primary)] shrink-0" aria-hidden="true" />
                    <span className="text-sm text-[var(--color-on-surface)] truncate">
                      {form.receiptName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    aria-label={t("expenseForm.removeFile")}
                    className="ml-3 p-1 rounded-full text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors duration-200 shrink-0"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={t("expenseForm.uploadAriaLabel")}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 px-6 py-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 select-none",
                    isDragging
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                      : "border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/60 hover:bg-[var(--color-surface-container-low)]"
                  )}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]">
                    <Upload className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[var(--color-on-surface)]">
                      {t("expenseForm.uploadCta")}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                      {t("expenseForm.uploadHint")}
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,.png,.jpg,.jpeg,.pdf"
                onChange={handleFileChange}
                className="sr-only"
                aria-hidden="true"
                tabIndex={-1}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--color-outline-variant)]">
              <Link
                href="/transactions"
                className="px-6 py-2.5 text-sm font-semibold text-[var(--color-on-surface)] bg-white border border-[var(--color-outline-variant)] rounded-lg hover:bg-[var(--color-surface-container-low)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40"
              >
                {t("expenseForm.cancelButton")}
              </Link>
              <motion.button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-container)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40"
              >
                {isSaving ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="h-4 w-4" aria-hidden="true" />
                )}
                {isSaving ? t("expenseForm.savingButton") : t("expenseForm.saveButton")}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Reveal>
    </div>
  );
}

export default function AddEditExpensePage() {
  return (
    <Suspense fallback={null}>
      <AddEditExpensePageInner />
    </Suspense>
  );
}
