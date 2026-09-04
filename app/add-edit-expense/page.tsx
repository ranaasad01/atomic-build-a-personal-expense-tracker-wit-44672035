"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { DollarSign, Calendar, Tag, FileText, Upload, X, Save, ArrowLeft, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { DEFAULT_CATEGORIES } from "@/lib/data";
type CATEGORY_BADGE_STYLES = any;
const CATEGORY_BADGE_STYLES: any = [];

const FORM_CATEGORIES = DEFAULT_CATEGORIES.map((c) => c.name);

type FormState = {
  amount: string;
  category: string;
  date: string;
  description: string;
  receiptFile: File | null;
  receiptPreview: string | null;
};

type FormErrors = {
  amount?: string;
  category?: string;
  date?: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function AddEditExpensePage() {
  const t = useTranslations();

  const [form, setForm] = useState<FormState>({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    receiptFile: null,
    receiptPreview: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const parsed = parseFloat(form.amount);
    if (!form.amount || isNaN(parsed) || parsed <= 0) {
      newErrors.amount = t("addExpense.errors.amountRequired");
    } else if (parsed > 1000000) {
      newErrors.amount = t("addExpense.errors.amountMax");
    }
    if (!form.category) {
      newErrors.category = t("addExpense.errors.categoryRequired");
    }
    if (!form.date) {
      newErrors.date = t("addExpense.errors.dateRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitStatus("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitStatus("success");
  };

  const handleFileSelect = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) return;
    const allowed = ["image/svg+xml", "image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(file.type)) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({
        ...prev,
        receiptFile: file,
        receiptPreview: file.type.startsWith("image/") ? (ev.target?.result as string) : null,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeFile = () => {
    setForm((prev) => ({ ...prev, receiptFile: null, receiptPreview: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const badgeStyle = form.category
    ? (CATEGORY_BADGE_STYLES[form.category] ?? { bg: "bg-slate-100", text: "text-slate-600" })
    : null;

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center px-4">
        <Reveal>
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_10px_15px_-3px_rgba(0,0,0,0.03)] p-10 max-w-md w-full text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mx-auto mb-5">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--color-on-surface)] mb-2">
              {t("addExpense.success.title")}
            </h2>
            <p className="text-[var(--color-on-surface-variant)] mb-8 leading-relaxed">
              {t("addExpense.success.body")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setForm({
                    amount: "",
                    category: "",
                    date: new Date().toISOString().split("T")[0],
                    description: "",
                    receiptFile: null,
                    receiptPreview: null,
                  });
                  setErrors({});
                  setSubmitStatus("idle");
                }}
                className="px-5 py-2.5 rounded-lg border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] text-sm font-medium hover:bg-[var(--color-surface-container-low)] transition-colors duration-200"
              >
                {t("addExpense.success.addAnother")}
              </button>
              <Link
                href="/transactions"
                className="px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-container)] transition-colors duration-200 text-center"
              >
                {t("addExpense.success.viewTransactions")}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Reveal>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            {t("addExpense.backLink")}
          </Link>
        </Reveal>

        {/* Page header */}
        <Reveal delay={0.05}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight mb-2">
              {t("addExpense.heading")}
            </h1>
            <div className="inline-flex items-center gap-1.5 text-sm text-[var(--color-on-surface-variant)]">
              <Lock className="h-3.5 w-3.5" />
              <span>{t("addExpense.secureLabel")}</span>
            </div>
          </div>
        </Reveal>

        {/* Form card */}
        <Reveal delay={0.1}>
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_10px_15px_-3px_rgba(0,0,0,0.03)] p-8">
            <form onSubmit={handleSubmit} noValidate>
              {/* Amount */}
              <div className="mb-6">
                <label
                  htmlFor="amount"
                  className="block text-sm font-semibold text-[var(--color-on-surface)] mb-2"
                >
                  {t("addExpense.fields.amount")}
                </label>
                <div
                  className={cn(
                    "flex items-center gap-3 h-14 rounded-lg border px-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20",
                    errors.amount
                      ? "border-[var(--color-error)] bg-red-50"
                      : "border-[var(--color-outline-variant)] focus-within:border-[var(--color-primary)]"
                  )}
                >
                  <DollarSign className="h-5 w-5 text-[var(--color-on-surface-variant)] shrink-0" />
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
                    className="flex-1 bg-transparent text-2xl font-semibold text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] outline-none tabular-nums"
                  />
                  {form.amount && !errors.amount && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      USD
                    </span>
                  )}
                </div>
                {errors.amount && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-error)]">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.amount}
                  </p>
                )}
              </div>

              {/* Category + Date row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-[var(--color-on-surface)] mb-2"
                  >
                    {t("addExpense.fields.category")}
                  </label>
                  <div
                    className={cn(
                      "flex items-center gap-2 h-11 rounded-lg border px-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20",
                      errors.category
                        ? "border-[var(--color-error)] bg-red-50"
                        : "border-[var(--color-outline-variant)] focus-within:border-[var(--color-primary)]"
                    )}
                  >
                    <Tag className="h-4 w-4 text-[var(--color-on-surface-variant)] shrink-0" />
                    <select
                      id="category"
                      value={form.category}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, category: e.target.value }));
                        if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                      }}
                      className="flex-1 bg-transparent text-sm text-[var(--color-on-surface)] outline-none appearance-none cursor-pointer"
                    >
                      <option value="">{t("addExpense.fields.categoryPlaceholder")}</option>
                      {FORM_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.category && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-error)]">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.category}
                    </p>
                  )}
                  {form.category && badgeStyle && (
                    <div className="mt-2">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          badgeStyle.bg,
                          badgeStyle.text
                        )}
                      >
                        {form.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-semibold text-[var(--color-on-surface)] mb-2"
                  >
                    {t("addExpense.fields.date")}
                  </label>
                  <div
                    className={cn(
                      "flex items-center gap-2 h-11 rounded-lg border px-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20",
                      errors.date
                        ? "border-[var(--color-error)] bg-red-50"
                        : "border-[var(--color-outline-variant)] focus-within:border-[var(--color-primary)]"
                    )}
                  >
                    <Calendar className="h-4 w-4 text-[var(--color-on-surface-variant)] shrink-0" />
                    <input
                      id="date"
                      type="date"
                      value={form.date}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, date: e.target.value }));
                        if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                      }}
                      className="flex-1 bg-transparent text-sm text-[var(--color-on-surface)] outline-none"
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-error)]">
                      <AlertCircle className="h-3.5 w-3.5" />
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
                  {t("addExpense.fields.description")}{" "}
                  <span className="font-normal text-[var(--color-on-surface-variant)]">
                    {t("addExpense.fields.optional")}
                  </span>
                </label>
                <div className="relative rounded-lg border border-[var(--color-outline-variant)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all duration-200">
                  <FileText className="absolute top-3.5 left-3.5 h-4 w-4 text-[var(--color-on-surface-variant)]" />
                  <textarea
                    id="description"
                    rows={4}
                    placeholder={t("addExpense.fields.descriptionPlaceholder")}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    maxLength={500}
                    className="w-full bg-transparent text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] outline-none resize-none pl-10 pr-4 py-3 rounded-lg"
                  />
                </div>
                <div className="mt-1 flex justify-end">
                  <span className="text-xs text-[var(--color-on-surface-variant)]">
                    {form.description.length}/500
                  </span>
                </div>
              </div>

              {/* Receipt upload */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-[var(--color-on-surface)] mb-2">
                  {t("addExpense.fields.receipt")}{" "}
                  <span className="font-normal text-[var(--color-on-surface-variant)]">
                    {t("addExpense.fields.optional")}
                  </span>
                </label>

                {form.receiptFile ? (
                  <div className="rounded-lg border border-[var(--color-outline-variant)] p-4 flex items-center gap-4">
                    {form.receiptPreview ? (
                      <img
                        src={form.receiptPreview}
                        alt="Receipt preview"
                        className="h-16 w-16 object-cover rounded-lg border border-[var(--color-outline-variant)]"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-[var(--color-surface-container-low)] flex items-center justify-center border border-[var(--color-outline-variant)]">
                        <FileText className="h-7 w-7 text-[var(--color-on-surface-variant)]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
                        {form.receiptFile.name}
                      </p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                        {(form.receiptFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 rounded-full hover:bg-[var(--color-surface-container)] transition-colors duration-200"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4 text-[var(--color-on-surface-variant)]" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "rounded-lg border-2 border-dashed p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
                      isDragging
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-container)]/30"
                        : "border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)]"
                    )}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-surface-container-low)] mb-3">
                      <Upload className="h-6 w-6 text-[var(--color-on-surface-variant)]" />
                    </div>
                    <p className="text-sm font-medium text-[var(--color-on-surface)] mb-1">
                      {t("addExpense.upload.cta")}
                    </p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">
                      {t("addExpense.upload.hint")}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-[var(--color-outline-variant)]">
                <Link
                  href="/transactions"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-[var(--color-outline-variant)] text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors duration-200 text-center"
                >
                  {t("addExpense.actions.cancel")}
                </Link>
                <motion.button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200",
                    submitStatus === "loading"
                      ? "bg-[var(--color-primary)]/70 cursor-not-allowed"
                      : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] shadow-[0_1px_3px_rgba(53,37,205,0.3)]"
                  )}
                >
                  {submitStatus === "loading" ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {t("addExpense.actions.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {t("addExpense.actions.save")}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </Reveal>

        {/* Tips card */}
        <Reveal delay={0.15}>
          <div className="mt-6 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)] p-5">
            <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-3">
              {t("addExpense.tips.title")}
            </h3>
            <ul className="space-y-2">
              {(
                Array.isArray(t.raw("addExpense.tips.items"))
                  ? t.raw("addExpense.tips.items")
                  : []
              ).map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)]">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}