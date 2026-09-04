"use client";

import { type ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { AppTopBar } from "@/components/Navbar";
import { useTranslations } from "next-intl";

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

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      {/* Sidebar */}
      <Sidebar userName={userName} userEmail={userEmail} avatarUrl={avatarUrl} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 ml-[200px] min-w-0 overflow-hidden">
        {/* Top bar */}
        <AppTopBar pageTitle={pageTitle} notificationCount={notificationCount} />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}