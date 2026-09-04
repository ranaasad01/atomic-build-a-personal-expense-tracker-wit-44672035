"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, TrendingUp, PieChart, Bell, CheckCircle, Star, ChevronRight, Lock, BarChart2, Zap } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { useTranslations } from "next-intl";

const FEATURES = [
  {
    icon: PieChart,
    color: "#4f46e5",
    bg: "#ede9fe",
    title: "Category Breakdown",
    desc: "Instantly see where your money goes with visual category breakdowns and donut charts.",
  },
  {
    icon: TrendingUp,
    color: "#006c49",
    bg: "#d1fae5",
    title: "Spending Trends",
    desc: "Track monthly patterns and spot habits before they become problems.",
  },
  {
    icon: Shield,
    color: "#3525cd",
    bg: "#e0e7ff",
    title: "Private by Default",
    desc: "Your financial data is encrypted and isolated. Only you can see your expenses.",
  },
  {
    icon: Bell,
    color: "#684000",
    bg: "#fef3c7",
    title: "Budget Alerts",
    desc: "Set monthly budgets per category and get notified before you overspend.",
  },
  {
    icon: Zap,
    color: "#0ea5e9",
    bg: "#e0f2fe",
    title: "Instant Logging",
    desc: "Add a new expense in seconds with a streamlined form and smart category suggestions.",
  },
  {
    icon: BarChart2,
    color: "#ef4444",
    bg: "#fee2e2",
    title: "Monthly Reports",
    desc: "Download or view detailed monthly summaries with income, spend, and net savings.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah J.",
    role: "Freelance Designer",
    avatar: "SJ",
    avatarColor: "#4f46e5",
    quote:
      "SpendWise transformed how I view my money. It's clean, intuitive, and incredibly reliable. I finally know where every dollar goes.",
    rating: 5,
  },
  {
    name: "Marcus T.",
    role: "Software Engineer",
    avatar: "MT",
    avatarColor: "#006c49",
    quote:
      "The category breakdown alone saved me from overspending on subscriptions. The reports are genuinely useful, not just pretty charts.",
    rating: 5,
  },
  {
    name: "Priya K.",
    role: "Product Manager",
    avatar: "PK",
    avatarColor: "#684000",
    quote:
      "I tried four expense trackers before this one. SpendWise is the only one that stuck because it respects my time and my privacy.",
    rating: 5,
  },
];

const STATS = [
  { value: "50K+", label: "Active users" },
  { value: "$2.4B", label: "Expenses tracked" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Average rating" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create your account",
    desc: "Sign up in under 30 seconds. No credit card required. Your data is private from day one.",
  },
  {
    step: "02",
    title: "Log your expenses",
    desc: "Add expenses with amount, category, date, and an optional receipt. Takes less than 10 seconds per entry.",
  },
  {
    step: "03",
    title: "Understand your spending",
    desc: "View category breakdowns, monthly trends, and budget progress on your personal dashboard.",
  },
];

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-[var(--color-surface)]">
      {/* Hero */}
      <Reveal>
        <section
          id="hero"
          className="relative overflow-hidden px-6 pt-20 pb-24 md:pt-28 md:pb-32"
          style={{ background: "linear-gradient(135deg, #f0f3ff 0%, #f9f9ff 60%, #e7eefe 100%)" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 60% 20%, rgba(79,70,229,0.10) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span
                className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold"
                style={{
                  background: "#e0e7ff",
                  borderColor: "#c7c4d8",
                  color: "#3525cd",
                }}
              >
                <Lock className="h-3.5 w-3.5" />
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
              className="mx-auto max-w-3xl text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl"
              style={{ color: "#151c27", letterSpacing: "-0.02em" }}
            >
              {t("hero.headline")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.16 }}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
              style={{ color: "#464555" }}
            >
              {t("hero.subheadline")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.24 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ background: "#3525cd", focusRingColor: "#3525cd" } as React.CSSProperties}
              >
                {t("hero.cta_primary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border px-7 py-3.5 text-base font-semibold transition-all duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ borderColor: "#c7c4d8", color: "#151c27" }}
              >
                {t("hero.cta_secondary")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.36 }}
              className="mt-16 overflow-hidden rounded-2xl border shadow-xl"
              style={{
                borderColor: "#dce2f3",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.05), 0px 20px 40px -8px rgba(53,37,205,0.12)",
              }}
            >
              <img
                src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/8e5231ada8c4428eb1a3d4f5fe6f8d21.png"
                alt="SpendWise dashboard showing expense categories and spending trends"
                className="w-full rounded-2xl"
              />
              <div
                className="flex items-center justify-between rounded-b-2xl px-6 py-4"
                style={{ background: "#ffffff", borderTop: "1px solid #e2e8f8" }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#006c49" }} />
                  <span className="text-sm font-medium" style={{ color: "#464555" }}>
                    {t("hero.preview_label")}
                  </span>
                </div>
                <span className="text-sm" style={{ color: "#777587" }}>
                  {t("hero.preview_sub")}
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* Stats */}
      <Reveal>
        <section id="stats" className="border-y px-6 py-14" style={{ borderColor: "#dce2f3", background: "#ffffff" }}>
          <div className="mx-auto max-w-5xl">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-2 gap-8 md:grid-cols-4"
            >
              {STATS.map((stat) => (
                <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                  <div
                    className="text-4xl font-bold tracking-tight"
                    style={{ color: "#3525cd", letterSpacing: "-0.02em" }}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-medium" style={{ color: "#464555" }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* Features */}
      <Reveal>
        <section id="features" className="px-6 py-24 md:py-32" style={{ background: "#f9f9ff" }}>
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <span
                className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                style={{ background: "#e0e7ff", color: "#3525cd" }}
              >
                {t("features.eyebrow")}
              </span>
              <h2
                className="text-balance text-3xl font-semibold tracking-tight md:text-4xl"
                style={{ color: "#151c27", letterSpacing: "-0.01em" }}
              >
                {t("features.headline")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed" style={{ color: "#464555" }}>
                {t("features.subheadline")}
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.title}
                    variants={fadeInUp}
                    whileHover={{ y: -4, boxShadow: "0px 8px 24px -4px rgba(53,37,205,0.12)" }}
                    className="rounded-xl border bg-white p-6 transition-all duration-300"
                    style={{
                      borderColor: "#e2e8f8",
                      boxShadow: "0px 1px 3px rgba(0,0,0,0.05), 0px 10px 15px -3px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div
                      className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg"
                      style={{ background: feat.bg }}
                    >
                      <Icon className="h-5 w-5" style={{ color: feat.color }} />
                    </div>
                    <h3 className="mb-2 text-base font-semibold" style={{ color: "#151c27" }}>
                      {feat.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#464555" }}>
                      {feat.desc}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* How it works */}
      <Reveal>
        <section
          id="how-it-works"
          className="px-6 py-24 md:py-32"
          style={{ background: "linear-gradient(135deg, #3525cd 0%, #4f46e5 100%)" }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <span
                className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                style={{ background: "rgba(255,255,255,0.15)", color: "#dad7ff" }}
              >
                {t("howItWorks.eyebrow")}
              </span>
              <h2
                className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl"
                style={{ letterSpacing: "-0.01em" }}
              >
                {t("howItWorks.headline")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed" style={{ color: "#c3c0ff" }}>
                {t("howItWorks.subheadline")}
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid gap-8 md:grid-cols-3"
            >
              {HOW_IT_WORKS.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={fadeInUp}
                  className="relative rounded-xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <div
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: "rgba(255,255,255,0.18)", color: "#ffffff" }}
                  >
                    {step.step}
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#c3c0ff" }}>
                    {step.desc}
                  </p>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div
                      className="absolute -right-4 top-10 hidden h-0.5 w-8 md:block"
                      style={{ background: "rgba(255,255,255,0.2)" }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* Testimonials */}
      <Reveal>
        <section id="testimonials" className="px-6 py-24 md:py-32" style={{ background: "#f0f3ff" }}>
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <span
                className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                style={{ background: "#e0e7ff", color: "#3525cd" }}
              >
                {t("testimonials.eyebrow")}
              </span>
              <h2
                className="text-balance text-3xl font-semibold tracking-tight md:text-4xl"
                style={{ color: "#151c27", letterSpacing: "-0.01em" }}
              >
                {t("testimonials.headline")}
              </h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {TESTIMONIALS.map((t_item) => (
                <motion.div
                  key={t_item.name}
                  variants={fadeInUp}
                  whileHover={{ y: -3 }}
                  className="flex flex-col rounded-xl border bg-white p-6 transition-all duration-300"
                  style={{
                    borderColor: "#e2e8f8",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.05), 0px 10px 15px -3px rgba(0,0,0,0.03)",
                  }}
                >
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: t_item.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" style={{ color: "#f59e0b" }} />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed" style={{ color: "#464555" }}>
                    &ldquo;{t_item.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ background: t_item.avatarColor }}
                    >
                      {t_item.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#151c27" }}>
                        {t_item.name}
                      </div>
                      <div className="text-xs" style={{ color: "#777587" }}>
                        {t_item.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* Security trust strip */}
      <Reveal>
        <section className="border-y px-6 py-12" style={{ borderColor: "#dce2f3", background: "#ffffff" }}>
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
              <p className="text-center text-sm font-semibold uppercase tracking-widest md:text-left" style={{ color: "#777587" }}>
                {t("trust.label")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:justify-end">
                {[
                  { icon: Shield, label: t("trust.item1") },
                  { icon: Lock, label: t("trust.item2") },
                  { icon: CheckCircle, label: t("trust.item3") },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" style={{ color: "#3525cd" }} />
                      <span className="text-sm font-medium" style={{ color: "#151c27" }}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <section id="cta" className="px-6 py-24 md:py-32" style={{ background: "#f9f9ff" }}>
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="text-balance text-3xl font-bold tracking-tight md:text-4xl"
              style={{ color: "#151c27", letterSpacing: "-0.02em" }}
            >
              {t("cta.headline")}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed" style={{ color: "#464555" }}>
              {t("cta.subheadline")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ background: "#3525cd" }}
              >
                {t("cta.button")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-5 text-sm" style={{ color: "#777587" }}>
              {t("cta.footnote")}
            </p>
          </div>
        </section>
      </Reveal>
    </main>
  );
}