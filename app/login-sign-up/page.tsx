"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
type APP_NAME = any;
const APP_NAME: any = [];
type APP_TAGLINE = any;
const APP_TAGLINE: any = [];
import { useTranslations } from "next-intl";

const TESTIMONIAL = {
  quote:
    "SpendWise transformed how I view my money. It's clean, intuitive, and incredibly reliable.",
  author: "Sarah J.",
  role: "Verified User",
  initials: "SJ",
};

const FEATURES = [
  { icon: TrendingUp, text: "Real-time expense tracking" },
  { icon: Shield, text: "Bank-level security" },
  { icon: CheckCircle, text: "Private & encrypted data" },
];

export default function LoginSignUpPage() {
  const t = useTranslations();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email.trim()) newErrors.email = t("auth.errors.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = t("auth.errors.emailInvalid");
    if (!form.password) newErrors.password = t("auth.errors.passwordRequired");
    else if (form.password.length < 8)
      newErrors.password = t("auth.errors.passwordLength");
    if (mode === "signup") {
      if (!form.fullName.trim()) newErrors.fullName = t("auth.errors.nameRequired");
      if (!form.confirmPassword)
        newErrors.confirmPassword = t("auth.errors.confirmRequired");
      else if (form.confirmPassword !== form.password)
        newErrors.confirmPassword = t("auth.errors.passwordMismatch");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setErrors({});
    setForm({ email: "", password: "", confirmPassword: "", fullName: "" });
    setSuccess(false);
  };

  return (
    <main className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-4 md:p-8">
      <Reveal className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(53,37,205,0.15),0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-[var(--color-outline-variant)]">
          {/* Left Panel */}
          <div className="relative bg-gradient-to-br from-[var(--color-primary)] via-[#4f46e5] to-[#6366f1] p-8 md:p-10 flex flex-col justify-between min-h-[480px] overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
              <div className="absolute top-1/3 -left-12 w-48 h-48 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 right-8 w-32 h-32 rounded-full bg-white/10" />
            </div>

            {/* Hero image area */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <img
                src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/ab3ce9c9eb4a4f05917a9a03cb90da28.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10">
              {/* Brand */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-white font-bold text-lg leading-none block">
                    {APP_NAME}
                  </span>
                  <span className="text-white/60 text-xs">{APP_TAGLINE}</span>
                </div>
              </div>

              <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-3 tracking-tight">
                {t("auth.panel.headline")}
              </h1>
              <p className="text-white/75 text-sm leading-relaxed mb-8">
                {t("auth.panel.subheadline")}
              </p>

              {/* Features */}
              <ul className="space-y-3">
                {FEATURES.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                      <feat.icon className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                    </div>
                    <span className="text-white/85 text-sm">{feat.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonial */}
            <div className="relative z-10 mt-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
                <p className="text-white/90 text-sm leading-relaxed italic mb-4">
                  &ldquo;{TESTIMONIAL.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{TESTIMONIAL.initials}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm leading-none mb-0.5">
                      {TESTIMONIAL.author}
                    </p>
                    <p className="text-white/60 text-xs">{TESTIMONIAL.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel — Form */}
          <div className="bg-white p-8 md:p-10 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              {/* Mode toggle */}
              <div className="flex rounded-lg border border-[var(--color-outline-variant)] p-1 mb-8 bg-[var(--color-surface-container-low)]">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                    mode === "signin"
                      ? "bg-white text-[var(--color-primary)] shadow-sm border border-[var(--color-outline-variant)]"
                      : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
                  }`}
                >
                  {t("auth.tabs.signIn")}
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                    mode === "signup"
                      ? "bg-white text-[var(--color-primary)] shadow-sm border border-[var(--color-outline-variant)]"
                      : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
                  }`}
                >
                  {t("auth.tabs.signUp")}
                </button>
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h2 className="text-[var(--color-on-surface)] text-2xl font-bold tracking-tight mb-1">
                  {mode === "signin" ? t("auth.signin.heading") : t("auth.signup.heading")}
                </h2>
                <p className="text-[var(--color-on-surface-variant)] text-sm">
                  {mode === "signin"
                    ? t("auth.signin.subheading")
                    : t("auth.signup.subheading")}
                </p>
              </div>

              {/* Success message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>
                    {mode === "signin"
                      ? t("auth.signin.successMessage")
                      : t("auth.signup.successMessage")}
                  </span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Full Name (signup only) */}
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-[var(--color-on-surface)] mb-1.5"
                    >
                      {t("auth.fields.fullName")}
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      placeholder={t("auth.fields.fullNamePlaceholder")}
                      className={`w-full h-11 px-4 rounded-lg border text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] bg-white transition-colors duration-150 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] ${
                        errors.fullName
                          ? "border-[var(--color-error)]"
                          : "border-[var(--color-outline-variant)]"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-[var(--color-error)]">{errors.fullName}</p>
                    )}
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[var(--color-on-surface)] mb-1.5"
                  >
                    {t("auth.fields.email")}
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-outline)]"
                      aria-hidden="true"
                    />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder={t("auth.fields.emailPlaceholder")}
                      className={`w-full h-11 pl-10 pr-4 rounded-lg border text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] bg-white transition-colors duration-150 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] ${
                        errors.email
                          ? "border-[var(--color-error)]"
                          : "border-[var(--color-outline-variant)]"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-[var(--color-error)]">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[var(--color-on-surface)] mb-1.5"
                  >
                    {t("auth.fields.password")}
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-outline)]"
                      aria-hidden="true"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder={t("auth.fields.passwordPlaceholder")}
                      className={`w-full h-11 pl-10 pr-10 rounded-lg border text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] bg-white transition-colors duration-150 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] ${
                        errors.password
                          ? "border-[var(--color-error)]"
                          : "border-[var(--color-outline-variant)]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? t("auth.fields.hidePassword") : t("auth.fields.showPassword")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-[var(--color-error)]">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password (signup only) */}
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                  >
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-[var(--color-on-surface)] mb-1.5"
                    >
                      {t("auth.fields.confirmPassword")}
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-outline)]"
                        aria-hidden="true"
                      />
                      <input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        placeholder={t("auth.fields.confirmPasswordPlaceholder")}
                        className={`w-full h-11 pl-10 pr-10 rounded-lg border text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] bg-white transition-colors duration-150 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] ${
                          errors.confirmPassword
                            ? "border-[var(--color-error)]"
                            : "border-[var(--color-outline-variant)]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={showConfirm ? t("auth.fields.hidePassword") : t("auth.fields.showPassword")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors"
                      >
                        {showConfirm ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-[var(--color-error)]">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Remember me / Forgot password (signin only) */}
                {mode === "signin" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--color-outline-variant)] accent-[var(--color-primary)]"
                      />
                      <span className="text-sm text-[var(--color-on-surface-variant)]">
                        {t("auth.signin.rememberMe")}
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-sm font-semibold text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 rounded"
                    >
                      {t("auth.signin.forgotPassword")}
                    </button>
                  </div>
                )}

                {/* Terms (signup only) */}
                {mode === "signup" && (
                  <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                    {t("auth.signup.termsPrefix")}{" "}
                    <button
                      type="button"
                      className="text-[var(--color-primary)] font-semibold hover:underline"
                    >
                      {t("auth.signup.termsLink")}
                    </button>{" "}
                    {t("auth.signup.termsAnd")}{" "}
                    <button
                      type="button"
                      className="text-[var(--color-primary)] font-semibold hover:underline"
                    >
                      {t("auth.signup.privacyLink")}
                    </button>
                    .
                  </p>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full h-11 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:ring-offset-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      {t("auth.form.loading")}
                    </span>
                  ) : (
                    <>
                      {mode === "signin" ? t("auth.signin.submitButton") : t("auth.signup.submitButton")}
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </motion.button>

                {/* Demo bypass */}
                <Link
                  href="/dashboard"
                  className="w-full h-11 rounded-lg border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] font-semibold text-sm flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-[var(--color-surface-container-low)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
                >
                  {t("auth.form.demoButton")}
                </Link>
              </form>

              {/* Switch mode link */}
              <p className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]">
                {mode === "signin" ? (
                  <>
                    {t("auth.signin.noAccount")}{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="text-[var(--color-primary)] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 rounded"
                    >
                      {t("auth.signin.signUpLink")}
                    </button>
                  </>
                ) : (
                  <>
                    {t("auth.signup.hasAccount")}{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="text-[var(--color-primary)] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 rounded"
                    >
                      {t("auth.signup.signInLink")}
                    </button>
                  </>
                )}
              </p>

              {/* Security note */}
              <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[var(--color-outline)]">
                <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t("auth.form.securityNote")}</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  );
}