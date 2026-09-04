"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, TrendingUp, CheckCircle } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const TESTIMONIAL = {
  quote:
    "SpendWise transformed how I view my money. It's clean, intuitive, and incredibly reliable. I finally know where every dollar goes.",
  name: "Sarah J.",
  role: "Freelance Designer",
  initials: "SJ",
};

const FEATURES = [
  "Private & encrypted expense tracking",
  "Smart category breakdowns",
  "Monthly budget insights",
];

export default function SignUpPage() {
  const t = useTranslations();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const userData = {
        name: form.name,
        email: form.email,
        loggedIn: true,
      };
      sessionStorage.setItem("spendwise_user", JSON.stringify(userData));
      setLoading(false);
      router.push("/dashboard");
    }, 900);
  }

  const inputBase =
    "w-full h-11 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200";

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-4 md:p-8">
      <Reveal className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(53,37,205,0.18),0_4px_16px_-4px_rgba(53,37,205,0.10)] border border-[var(--color-outline-variant)]">

          {/* LEFT PANEL */}
          <div className="relative flex flex-col justify-between bg-gradient-to-br from-[var(--color-primary)] via-[#4f46e5] to-[#7c3aed] p-8 md:p-10 md:w-[48%] overflow-hidden">
            {/* Background watermark */}
            <div
              aria-hidden="true"
              className="absolute top-6 right-6 text-white/10 font-bold text-3xl tracking-widest uppercase select-none pointer-events-none"
            >
              SPEND<br />WISE
            </div>

            {/* Decorative blobs */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute bottom-1/3 right-0 w-48 h-48 rounded-full bg-violet-400/10 blur-2xl" />
              <svg
                className="absolute top-24 left-1/2 -translate-x-1/2 opacity-20"
                width="260"
                height="260"
                viewBox="0 0 260 260"
                fill="none"
                aria-hidden="true"
              >
                <rect x="60" y="60" width="140" height="140" rx="24" stroke="white" strokeWidth="1.5" />
                <rect x="90" y="90" width="80" height="80" rx="12" stroke="white" strokeWidth="1" />
                <circle cx="130" cy="130" r="20" stroke="white" strokeWidth="1" />
              </svg>
            </div>

            {/* Top: Brand */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-white font-bold text-xl leading-none block">SpendWise</span>
                  <span className="text-white/60 text-xs leading-none">Personal Finance</span>
                </div>
              </div>

              <h2 className="text-white text-2xl font-bold leading-snug mb-2">
                Take control of every dollar you spend.
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-8">
                Join thousands of people who track smarter and save more with SpendWise.
              </p>

              {/* Feature bullets */}
              <ul className="space-y-3">
                {FEATURES.map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-white/80 shrink-0" />
                    <span className="text-white/80 text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom: Testimonial */}
            <div className="relative z-10 mt-10">
              <div className="rounded-xl bg-white/10 border border-white/20 p-5 backdrop-blur-sm">
                <p className="text-white/90 text-sm leading-relaxed italic mb-4">
                  &ldquo;{TESTIMONIAL.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <span className="text-white font-semibold text-xs">{TESTIMONIAL.initials}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm leading-none">{TESTIMONIAL.name}</p>
                    <p className="text-white/60 text-xs mt-0.5">{TESTIMONIAL.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col justify-center bg-white p-8 md:p-10 md:w-[52%]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">
                  Create your account
                </h1>
                <p className="mt-1.5 text-sm text-[var(--color-on-surface-variant)]">
                  Free to start. No credit card required.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-outline)]" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={handleChange}
                      className={cn(inputBase, "pl-9")}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-outline)]" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className={cn(inputBase, "pl-9")}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-outline)]" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      className={cn(inputBase, "pl-9 pr-10")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-outline)]" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={cn(inputBase, "pl-9 pr-10")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-[var(--color-error)] bg-[var(--color-error-container)] rounded-lg px-3 py-2"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full h-11 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2",
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-[var(--color-primary-container)] hover:shadow-[0_4px_16px_-4px_rgba(53,37,205,0.4)] active:scale-[0.98]"
                  )}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Sign in link */}
              <p className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]">
                Already have an account?{" "}
                <Link
                  href="/auth"
                  className="font-semibold text-[var(--color-primary)] hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </p>

              {/* Privacy note */}
              <p className="mt-4 text-center text-xs text-[var(--color-outline)]">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="underline hover:text-[var(--color-primary)] transition-colors">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-[var(--color-primary)] transition-colors">
                  Privacy Policy
                </Link>.
              </p>
            </motion.div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
