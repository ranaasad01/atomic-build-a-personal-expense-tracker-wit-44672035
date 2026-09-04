"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks, publicNavLinks, BRAND } from "@/lib/data";
import { Bell, Search, User, Lock } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;

  // Determine if we're in the app shell (authenticated routes)
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/expenses");

  // App routes render their own top bar via AppLayout — don't double-render
  if (isAppRoute) return null;

  // Auth page — no navbar
  if (pathname.startsWith("/auth")) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-outline-variant)] backdrop-blur-sm"
    >
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
          aria-label={BRAND.name}
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <span className="font-bold text-[var(--color-primary)] text-lg leading-none block">
              {BRAND.name}
            </span>
            <span className="text-[10px] text-[var(--color-on-surface-variant)] leading-none">
              {BRAND.tagline}
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {publicNavLinks.map((link) => {
            const label = navT[link.key] ?? link.label;
            const isActive = pathname === link.href;

            if (link.href.startsWith("#")) {
              return (
                <Link
                  key={link.key}
                  href={pathname === "/" ? link.href : "/" + link.href}
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--color-surface-container)] text-[var(--color-primary)]"
                      : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)]"
                  }`}
                >
                  {label}
                </Link>
              );
            }

            return (
              <Link
                key={link.key}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--color-surface-container)] text-[var(--color-primary)]"
                    : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-container)] transition-all duration-200 shadow-sm"
          >
            {navT["signin"] ?? "Sign In"}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

// ─── App Top Bar (used inside app layout) ────────────────────────────────────

interface AppTopBarProps {
  pageTitle: string;
  notificationCount?: number;
}

export function AppTopBar({ pageTitle, notificationCount = 0 }: AppTopBarProps) {
  const t = useTranslations();

  return (
    <header className="h-14 bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-outline-variant)] flex items-center justify-between px-6 shrink-0">
      {/* Page title */}
      <h1 className="text-lg font-semibold text-[var(--color-primary)] tracking-tight">
        {pageTitle}
      </h1>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-1.5 w-52">
          <Search className="w-4 h-4 text-[var(--color-outline)]" aria-hidden="true" />
          <input
            type="search"
            placeholder={t("appBar.searchPlaceholder")}
            className="bg-transparent text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] outline-none w-full"
            aria-label={t("appBar.searchPlaceholder")}
          />
        </div>

        {/* Private & Secure badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]">
          <Lock className="w-3.5 h-3.5 text-[var(--color-outline)]" aria-hidden="true" />
          <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
            {t("appBar.privateSecure")}
          </span>
        </div>

        {/* Notification bell */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-container-low)] transition-colors"
          aria-label={t("appBar.notifications")}
        >
          <Bell className="w-5 h-5 text-[var(--color-on-surface-variant)]" aria-hidden="true" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-error)]" />
          )}
        </button>

        {/* User icon */}
        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-container-low)] transition-colors"
          aria-label={t("appBar.userMenu")}
        >
          <User className="w-5 h-5 text-[var(--color-on-surface-variant)]" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}