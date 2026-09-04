"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BRAND } from "@/lib/data";

const footerLinks = [
  { label: "Dashboard", href: "/dashboard", key: "dashboard" },
  { label: "Sign In", href: "/auth", key: "signin" },
  { label: "Privacy Policy", href: "/privacy", key: "privacy" },
  { label: "Terms of Service", href: "/terms", key: "terms" },
];

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;

  // Don't render footer inside app shell or auth pages
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/expenses") ||
    pathname.startsWith("/budget") ||
    pathname.startsWith("/auth");

  if (isAppRoute) return null;

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-outline-variant)] mt-auto"
    >
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="font-bold text-[var(--color-primary)] text-base">
                {BRAND.name}
              </span>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer navigation">
            {footerLinks.map((link) => {
              const label = navT[link.key] ?? link.label;

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
                    className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {label}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--color-outline-variant)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-outline)]">
            {t("footer.copyright")}
          </p>
          <p className="text-xs text-[var(--color-outline)]">
            {t("footer.madeWith")}
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
