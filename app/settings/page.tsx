"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { User, Lock, Settings, Shield, Download, Trash2, Bell, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/AppLayout";

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (\u20ac)" },
  { value: "GBP", label: "GBP (\u00a3)" },
  { value: "JPY", label: "JPY (\u00a5)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "AUD", label: "AUD (A$)" },
];

const THEME_OPTIONS = [
  { value: "light", label: "Light (System Default)" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "security", label: "Security", icon: Lock },
  { key: "preferences", label: "Preferences", icon: Settings },
  { key: "data", label: "Data & Privacy", icon: Shield },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function SettingsPage() {
  const t = useTranslations();

  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  // Profile state
  const [fullName, setFullName] = useState("Alex Doe");
  const [email, setEmail] = useState("alex.doe@example.com");
  const [profileSaved, setProfileSaved] = useState(false);

  // Security state
  const [twoFaEnabled, setTwoFaEnabled] = useState(true);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  // Preferences state
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("light");
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState("3000");
  const [prefSaved, setPrefSaved] = useState(false);

  // Data state
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleProfileSave() {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  }

  function handlePasswordSave() {
    setPwError("");
    if (!currentPw || !newPw || !confirmPw) {
      setPwError("All password fields are required.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }
    setPwSaved(true);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setTimeout(() => setPwSaved(false), 2500);
  }

  function handlePrefSave() {
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 2500);
  }

  function handleExportCSV() {
    const csv =
      "Date,Description,Category,Amount\n2023-10-24,Starbucks Coffee,Food & Drink,-5.50\n2023-10-23,Whole Foods Market,Groceries,-84.20\n2023-10-22,Uber Rides,Transport,-24.00";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spendwise-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const inputClass =
    "w-full h-11 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200";

  const selectClass =
    "w-full h-11 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200 cursor-pointer";

  return (
    <AppLayout pageTitle="Settings">
      <div className="max-w-[900px] mx-auto">
        {/* Page Header */}
        <Reveal>
          <div className="mb-8">
            <h1 className="text-[var(--color-on-surface)] text-3xl font-bold tracking-tight">
              {t("settings.heading")}
            </h1>
            <p className="mt-1 text-[var(--color-on-surface-variant)] text-base">
              {t("settings.subheading")}
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Tab Sidebar */}
          <Reveal className="md:w-52 shrink-0">
            <nav
              className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-2 flex flex-row md:flex-col gap-1"
              aria-label="Settings tabs"
            >
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left",
                    activeTab === key
                      ? "bg-[var(--color-surface-container)] text-[var(--color-primary)]"
                      : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]"
                  )}
                  aria-current={activeTab === key ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden md:inline">{label}</span>
                </button>
              ))}
            </nav>
          </Reveal>

          {/* Tab Content */}
          <div className="flex-1 min-w-0">
            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-on-surface)] mb-5">
                    {t("settings.profile.title")}
                  </h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--color-outline-variant)]">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center shrink-0">
                      <span className="text-xl font-bold text-[var(--color-primary)]">
                        {fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-on-surface)]">{fullName}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{email}</p>
                      <button className="mt-2 text-xs font-medium text-[var(--color-primary)] hover:underline transition-colors">
                        {t("settings.profile.changeAvatar")}
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                        {t("settings.profile.fullName")}
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={inputClass}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                        {t("settings.profile.email")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={handleProfileSave}
                      className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
                    >
                      {profileSaved ? (
                        <>
                          <Check className="h-4 w-4" />
                          {t("settings.saved")}
                        </>
                      ) : (
                        t("settings.profile.save")
                      )}
                    </button>
                  </div>
                </div>
              </Reveal>
            )}

            {/* ── SECURITY TAB ── */}
            {activeTab === "security" && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">
                    {t("settings.security.title")}
                  </h2>

                  {/* Change Password */}
                  <div className="pb-6 border-b border-[var(--color-outline-variant)]">
                    <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-4">
                      {t("settings.security.changePassword")}
                    </h3>
                    <div className="space-y-3">
                      {/* Current Password */}
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                          {t("settings.security.currentPassword")}
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPw ? "text" : "password"}
                            value={currentPw}
                            onChange={(e) => setCurrentPw(e.target.value)}
                            className={cn(inputClass, "pr-10")}
                            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPw((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                            aria-label={showCurrentPw ? "Hide password" : "Show password"}
                          >
                            {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                          {t("settings.security.newPassword")}
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPw ? "text" : "password"}
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)}
                            className={cn(inputClass, "pr-10")}
                            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPw((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                            aria-label={showNewPw ? "Hide password" : "Show password"}
                          >
                            {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                          {t("settings.security.confirmPassword")}
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPw ? "text" : "password"}
                            value={confirmPw}
                            onChange={(e) => setConfirmPw(e.target.value)}
                            className={cn(inputClass, "pr-10")}
                            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPw((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                            aria-label={showConfirmPw ? "Hide password" : "Show password"}
                          >
                            {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {pwError && (
                      <p className="mt-3 flex items-center gap-1.5 text-sm text-[var(--color-error)]">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {pwError}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={handlePasswordSave}
                        className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
                      >
                        {pwSaved ? (
                          <>
                            <Check className="h-4 w-4" />
                            {t("settings.saved")}
                          </>
                        ) : (
                          t("settings.security.updatePassword")
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 2FA */}
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">
                          {t("settings.security.twoFa")}
                        </h3>
                        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                          {t("settings.security.twoFaDesc")}
                        </p>
                      </div>
                      <button
                        role="switch"
                        aria-checked={twoFaEnabled}
                        onClick={() => setTwoFaEnabled((v) => !v)}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                          twoFaEnabled ? "bg-[var(--color-primary)]" : "bg-[var(--color-outline-variant)]"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                            twoFaEnabled ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {/* ── PREFERENCES TAB ── */}
            {activeTab === "preferences" && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">
                    {t("settings.preferences.title")}
                  </h2>

                  {/* Currency */}
                  <div className="pb-6 border-b border-[var(--color-outline-variant)]">
                    <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                      {t("settings.preferences.currency")}
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className={selectClass}
                    >
                      {CURRENCY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Theme */}
                  <div className="pb-6 border-b border-[var(--color-outline-variant)]">
                    <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                      {t("settings.preferences.theme")}
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className={selectClass}
                    >
                      {THEME_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Monthly Budget */}
                  <div className="pb-6 border-b border-[var(--color-outline-variant)]">
                    <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                      {t("settings.preferences.monthlyBudget")}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-on-surface-variant)]">
                        $
                      </span>
                      <input
                        type="number"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(e.target.value)}
                        className={cn(inputClass, "pl-7")}
                        placeholder="3000"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Notifications */}
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-4">
                      {t("settings.preferences.notifications")}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[var(--color-on-surface)]">
                            {t("settings.preferences.emailNotif")}
                          </p>
                          <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                            {t("settings.preferences.emailNotifDesc")}
                          </p>
                        </div>
                        <button
                          role="switch"
                          aria-checked={emailNotif}
                          onClick={() => setEmailNotif((v) => !v)}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                            emailNotif ? "bg-[var(--color-primary)]" : "bg-[var(--color-outline-variant)]"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                              emailNotif ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[var(--color-on-surface)]">
                            {t("settings.preferences.pushNotif")}
                          </p>
                          <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                            {t("settings.preferences.pushNotifDesc")}
                          </p>
                        </div>
                        <button
                          role="switch"
                          aria-checked={pushNotif}
                          onClick={() => setPushNotif((v) => !v)}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                            pushNotif ? "bg-[var(--color-primary)]" : "bg-[var(--color-outline-variant)]"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                              pushNotif ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrefSave}
                      className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
                    >
                      {prefSaved ? (
                        <>
                          <Check className="h-4 w-4" />
                          {t("settings.saved")}
                        </>
                      ) : (
                        t("settings.preferences.save")
                      )}
                    </button>
                  </div>
                </div>
              </Reveal>
            )}

            {/* ── DATA & PRIVACY TAB ── */}
            {activeTab === "data" && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">
                    {t("settings.data.title")}
                  </h2>

                  {/* Export */}
                  <div className="pb-6 border-b border-[var(--color-outline-variant)]">
                    <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-1">
                      {t("settings.data.export")}
                    </h3>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mb-4">
                      {t("settings.data.exportDesc")}
                    </p>
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center gap-2 rounded-lg border border-[var(--color-outline-variant)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-on-surface)] shadow-sm transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-md"
                    >
                      <Download className="h-4 w-4" />
                      {t("settings.data.exportBtn")}
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-error)] mb-1">
                      {t("settings.data.deleteAccount")}
                    </h3>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mb-4">
                      {t("settings.data.deleteDesc")}
                    </p>

                    {!showDeleteModal ? (
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 rounded-lg border border-[var(--color-error)] px-4 py-2.5 text-sm font-medium text-[var(--color-error)] transition-all duration-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("settings.data.deleteBtn")}
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-[var(--color-error)] bg-red-50 p-4"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <AlertTriangle className="h-5 w-5 text-[var(--color-error)] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-error)]">
                              {t("settings.data.deleteWarning")}
                            </p>
                            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                              {t("settings.data.deleteConfirmPrompt")}
                            </p>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          placeholder={t("settings.data.deleteConfirmPlaceholder")}
                          className="w-full h-10 rounded-lg border border-[var(--color-error)] bg-white px-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] mb-3"
                        />
                        <div className="flex items-center gap-3">
                          <button
                            disabled={deleteConfirm !== "DELETE"}
                            className="flex items-center gap-2 rounded-lg bg-[var(--color-error)] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-4 w-4" />
                            {t("settings.data.confirmDeleteBtn")}
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteModal(false);
                              setDeleteConfirm("");
                            }}
                            className="rounded-lg border border-[var(--color-outline-variant)] px-4 py-2 text-sm font-medium text-[var(--color-on-surface-variant)] transition-all duration-200 hover:bg-[var(--color-surface-container-low)]"
                          >
                            {t("settings.data.cancelDelete")}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
