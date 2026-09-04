"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, TrendingUp, CheckCircle } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
type APP_NAME = any;
const APP_NAME: any = [];
type APP_TAGLINE = any;
const APP_TAGLINE: any = [];
import { cn } from "@/lib/utils";

const TESTIMONIAL = {
  quote:
    "SpendWise transformed how I view my money. It's clean, intuitive, and incredibly reliable.",
  name: "Sarah J.",
  role: "Verified User",
  initials: "SJ",
};

const FEATURES = [
  "Private & encrypted expense tracking",
  "Smart category breakdowns",
  "Monthly budget insights",
];

export default function AuthPage() {
  const t = useTranslations();
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError(t("auth.errorRequired"));
      return;
    }
    if (mode === "signup" && !form.name.trim()) {
      setError(t("auth.errorName"));
      return;
    }
    if (form.password.length < 6) {
      setError(t("auth.errorPassword"));
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const userData = {
        name: mode === "signup" ? form.name : "Alex Doe",
        email: form.email,
        loggedIn: true,
        rememberMe,
      };
      if (rememberMe) {
        localStorage.setItem("spendwise_user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("spendwise_user", JSON.stringify(userData));
      }
      setLoading(false);
      router.push("/dashboard");
    }, 900);
  }

  function toggleMode() {
    setMode((m) => (m === "signin" ? "signup" : "signin"));
    setError("");
    setForm({ name: "", email: "", password: "" });
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-4 md:p-8">
      <Reveal className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(53,37,205,0.18),0_4px_16px_-4px_rgba(53,37,205,0.10)] border border-[var(--color-outline-variant)]">

          {/* LEFT PANEL */}
          <div className="relative flex flex-col justify-between bg-gradient-to-br from-[var(--color-primary)] via-[#4f46e5] to-[#7c3aed] p-8 md:p-10 md:w-[48%] overflow-hidden">
            {/* Background watermark text */}
            <div
              aria-hidden="true"
              className="absolute top-6 right-6 text-white/10 font-bold text-3xl tracking-widest uppercase select-none pointer-events-none"
            >
              KINETIC<br />FINANCE
            </div>

            {/* Abstract geometric decoration */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute bottom-1/3 right-0 w-48 h-48 rounded-full bg-violet-400/10 blur-2xl" />
              <svg
                className="absolute top-24 left-1/2 -translate-x-1/2 opacity-20"
                width="260"
                height="260"
                viewBox="0 0 260 260"
                fill="none"
              >
                <rect x="60" y="60" width="140" height="140" rx="16" stroke="white" strokeWidth="1.5" transform="rotate(15 130 130)" />
                <rect x="80" y="80" width="100" height="100" rx="12" stroke="white" strokeWidth="1" transform="rotate(30 130 130)" />
                <line x1="130" y1="30" x2="130" y2="230" stroke="white" strokeWidth="0.75" />
                <line x1="30" y1="130" x2="230" y2="130" stroke="white" strokeWidth="0.75" />
                <circle cx="130" cy="130" r="40" stroke="white" strokeWidth="1" />
                <path d="M90 170 L130 90 L170 150" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M110 190 L150 110 L190 170" stroke="white" strokeWidth="1" strokeLinejoin="round" opacity="0.6" />
              </svg>
              {/* Arrow up-right */}
              <svg
                className="absolute bottom-40 right-8 opacity-30"
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
              >
                <path d="M10 50 L50 10 M30 10 L50 10 L50 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Logo */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">{APP_NAME}</span>
              </div>

              <h1 className="text-white font-bold text-2xl md:text-3xl leading-tight mb-3 tracking-tight">
                {t("auth.leftHeading")}
              </h1>
              <p className="text-white/75 text-sm leading-relaxed mb-6 max-w-xs">
                {t("auth.leftSubheading")}
              </p>

              {/* Feature list */}
              <ul className="space-y-2 mb-8">
                {FEATURES.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-[var(--color-secondary-container)] flex-shrink-0" aria-hidden="true" />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Finance illustration placeholder */}
              <div className="relative rounded-xl overflow-hidden bg-white/10 border border-white/20 h-36 flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-end px-4 pb-3 gap-1">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t bg-white/30"
                      style={{ height: `${h}%` }}
                      initial={{ scaleY: 0, originY: 1 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                    />
                  ))}
                </div>
                <div className="relative z-10 text-center">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-widest">
                    {t("auth.illustrationLabel")}
                  </p>
                  <p className="text-white font-bold text-lg">$12,450.00</p>
                </div>
              </div>

              {/* "Welcome back" overlay hint */}
              <div className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 flex items-center gap-3 mb-6">
                <Mail className="w-4 h-4 text-white/60" aria-hidden="true" />
                <span className="text-white/50 text-xs">{t("auth.secureAccessLabel")}</span>
              </div>
            </div>

            {/* Testimonial card */}
            <div className="relative z-10 bg-white rounded-xl p-5 shadow-lg">
              <p className="text-[var(--color-on-surface)] text-sm leading-relaxed italic mb-4">
                &ldquo;{TESTIMONIAL.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {TESTIMONIAL.initials}
                </div>
                <div>
                  <p className="text-[var(--color-on-surface)] text-sm font-semibold leading-none mb-0.5">
                    {TESTIMONIAL.name}
                  </p>
                  <p className="text-[var(--color-on-surface-variant)] text-xs">
                    {TESTIMONIAL.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col justify-center bg-white px-8 py-10 md:px-12 md:w-[52%]">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <h2 className="text-[var(--color-on-surface)] font-bold text-2xl md:text-3xl tracking-tight mb-1">
                {mode === "signin" ? t("auth.signinHeading") : t("auth.signupHeading")}
              </h2>
              <p className="text-[var(--color-on-surface-variant)] text-sm mb-8">
                {mode === "signin" ? t("auth.signinSubheading") : t("auth.signupSubheading")}
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name field (sign up only) */}
                {mode === "signup" && (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[var(--color-on-surface)] text-sm font-semibold mb-1.5"
                    >
                      {t("auth.nameLabel")}
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-outline)]"
                        aria-hidden="true"
                      />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t("auth.namePlaceholder")}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm placeholder:text-[var(--color-outline)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[var(--color-on-surface)] text-sm font-semibold mb-1.5"
                  >
                    {t("auth.emailLabel")}
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-outline)]"
                      aria-hidden="true"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t("auth.emailPlaceholder")}
                      className="w-full h-11 pl-10 pr-4 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm placeholder:text-[var(--color-outline)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-[var(--color-on-surface)] text-sm font-semibold mb-1.5"
                  >
                    {t("auth.passwordLabel")}
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-outline)]"
                      aria-hidden="true"
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder={t("auth.passwordPlaceholder")}
                      className="w-full h-11 pl-10 pr-11 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm placeholder:text-[var(--color-outline)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot password */}
                {mode === "signin" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--color-outline-variant)] accent-[var(--color-primary)] cursor-pointer"
                      />
                      <span className="text-[var(--color-on-surface-variant)] text-sm">
                        {t("auth.rememberMe")}
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-[var(--color-primary)] text-sm font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
                    >
                      {t("auth.forgotPassword")}
                    </button>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[var(--color-error)] text-sm bg-[var(--color-error-container)] px-3 py-2 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={cn(
                    "w-full h-11 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200",
                    "hover:bg-[var(--color-primary-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
                    loading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      {t("auth.loading")}
                    </span>
                  ) : mode === "signin" ? (
                    t("auth.signinButton")
                  ) : (
                    t("auth.signupButton")
                  )}
                </motion.button>
              </form>

              {/* Toggle mode */}
              <p className="mt-6 text-center text-[var(--color-on-surface-variant)] text-sm">
                {mode === "signin" ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[var(--color-primary)] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
                >
                  {mode === "signin" ? t("auth.signupLink") : t("auth.signinLink")}
                </button>
              </p>

              {/* Demo shortcut */}
              <div className="mt-6 pt-6 border-t border-[var(--color-outline-variant)]">
                <p className="text-center text-[var(--color-on-surface-variant)] text-xs mb-3">
                  {t("auth.demoLabel")}
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    localStorage.setItem(
                      "spendwise_user",
                      JSON.stringify({ name: "Alex Doe", email: "demo@spendwise.app", loggedIn: true })
                    );
                    router.push("/dashboard");
                  }}
                  className="w-full h-11 rounded-lg border border-[var(--color-outline-variant)] bg-white text-[var(--color-on-surface)] font-semibold text-sm hover:bg-[var(--color-surface-container-low)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                >
                  {t("auth.demoButton")}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}