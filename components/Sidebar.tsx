"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks, BRAND } from "@/lib/data";

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
}

export default function Sidebar({ userName, userEmail, avatarUrl }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AL";

  return (
    <motion.aside
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed left-0 top-0 h-full w-[200px] bg-[var(--color-surface-container-lowest)] border-r border-[var(--color-outline-variant)] flex flex-col z-40"
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b border-[var(--color-outline-variant)]">
        <Link href="/dashboard" className="flex items-center gap-2 group" aria-label={BRAND.name}>
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <span className="font-bold text-[var(--color-primary)] text-base leading-none block">
              {BRAND.name}
            </span>
            <span className="text-[10px] text-[var(--color-on-surface-variant)] leading-none">
              {BRAND.tagline}
            </span>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="App navigation">
        {navLinks.map((link) => {
          const label = navT[link.key] ?? link.label;
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.key}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[var(--color-surface-container)] text-[var(--color-primary)] border-r-2 border-[var(--color-primary)]"
                  : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Material icon */}
              <span
                className={`material-symbols-outlined text-[20px] leading-none ${
                  isActive ? "text-[var(--color-primary)]" : "text-[var(--color-outline)]"
                }`}
                aria-hidden="true"
              >
                {link.icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User profile at bottom */}
      <div className="px-3 py-4 border-t border-[var(--color-outline-variant)]">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[var(--color-surface-container-low)] transition-colors group"
          aria-label="Go to settings"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName ?? "User avatar"}
              className="w-8 h-8 rounded-full object-cover border border-[var(--color-outline-variant)]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-[var(--color-primary)]">
                {initials}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
              {userName ?? t("sidebar.profile")}
            </p>
            {userEmail && (
              <p className="text-xs text-[var(--color-outline)] truncate">{userEmail}</p>
            )}
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}