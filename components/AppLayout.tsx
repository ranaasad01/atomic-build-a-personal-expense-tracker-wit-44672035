"use client";

import { type ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { useTranslations } from "next-intl";
import { Bell, Search } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  pageTitle: string;
  notificationCount?: number;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
}

export default function AppLayout({
  children,
  pageTitle,
  notificationCount = 0,
  userName,
  userEmail,
  avatarUrl,
}: AppLayoutProps) {
  const t = useTranslations();

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      {/* Sidebar */}
      <Sidebar userName={userName} userEmail={userEmail} avatarUrl={avatarUrl} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 ml-[200px] min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-outline-variant)] flex items-center justify-between px-6 shrink-0 shadow-sm">
          {/* Page title */}
          <h1 className="text-xl font-bold text-[var(--color-on-surface)] tracking-tight truncate">
            {pageTitle}
          </h1>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-[var(--color-on-surface-variant)] pointer-events-none" />
              <input
                type="search"
                placeholder={t("appBar.searchPlaceholder")}
                className="pl-9 pr-4 py-2 text-sm rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent w-56 transition"
              />
            </div>

            {/* Notification bell */}
            <button
              aria-label={t("appBar.notifications")}
              className="relative p-2 rounded-lg hover:bg-[var(--color-surface-container)] transition text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-danger)]" />
              )}
            </button>

            {/* User avatar */}
            <button
              aria-label={t("appBar.userMenu")}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--color-surface-container)] transition"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName ?? "User"}
                  className="w-8 h-8 rounded-full object-cover border border-[var(--color-outline-variant)]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
              )}
              {userName && (
                <span className="hidden lg:block text-sm font-medium text-[var(--color-on-surface)] max-w-[120px] truncate">
                  {userName}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
