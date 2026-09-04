import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: {
    default: "SpendWise – Personal Finance Tracker",
    template: "%s | SpendWise",
  },
  description:
    "Take control of every dollar you spend. SpendWise gives you a crystal-clear picture of your finances — track expenses by category, spot spending patterns, and stay on budget every month.",
  keywords: ["expense tracker", "personal finance", "budget", "spending", "money management"],
  openGraph: {
    title: "SpendWise – Personal Finance Tracker",
    description:
      "Track expenses by category, spot spending patterns, and stay on budget every month.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[var(--color-background)] text-[var(--color-on-surface)] antialiased">
        <LocaleProvider>
          <LanguageToggle />
          <Navbar />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
