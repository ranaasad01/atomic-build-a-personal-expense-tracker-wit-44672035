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
  const navT = (t.raw("nav") ?? {}) as Record<string, string>;

  // Determine if we're in the app shell (authenticated routes)
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/expenses") ||
    pathname.startsWith("/budget");

  // App routes render their own top bar via AppLayout — don't double-render
  if (isAppRoute) return null;

  // Auth / signup pages — no navbar
  if (pathname.startsWith("/auth") || pathname === "/signup") return null;

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
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-all duration-200"
          >
            <Lock className="h-4 w-4" />
            {navT["signin"] ?? "Sign In"}
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-container)] transition-all duration-200 shadow-sm"
          >
            {navT["signup"] ?? "Get Started"}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

// ─── App Top Bar (used inside AppLayout) ─────────────────────────────────────

export function AppTopBar({
  pageTitle,
  notificationCount = 0,
}: {
  pageTitle: string;
  notificationCount?: number;
}) {
  const t = useTranslations();
  const appBarT = (t.raw("appBar") ?? {}) as Record<string, string>;

  return (
    <header className="h-14 shrink-0 bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-outline-variant)] flex items-center justify-between px-6 gap-4">
      <h1 className="text-base font-semibold text-[var(--color-on-surface)] truncate">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-sm text-[var(--color-on-surface-variant)]">
          <Search className="h-4 w-4 shrink-0" />
          <span>{appBarT["searchPlaceholder"] ?? "Search transactions..."}</span>
        </div>

        {/* Private badge */}
        <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-[var(--color-outline-variant)] bg-white px-3 py-1 text-xs font-medium text-[var(--color-on-surface-variant)]">
          <Lock className="h-3 w-3" />
          {appBarT["privateSecure"] ?? "Private & Secure"}
        </span>

        {/* Notifications */}
        <button
          className="relative h-9 w-9 rounded-lg flex items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
          aria-label={appBarT["notifications"] ?? "View notifications"}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-danger)]" />
          )}
        </button>

        {/* User avatar */}
        <button
          className="h-9 w-9 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-primary)] hover:opacity-80 transition-opacity"
          aria-label={appBarT["userMenu"] ?? "User menu"}
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
