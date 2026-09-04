"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { User, Lock, Settings, Shield, Download, Trash2, Bell, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
type CURRENCIES = any;
const CURRENCIES: { value: string; label: string }[] = [];
type THEMES = any;
const THEMES: { value: string; label: string }[] = [];
import { cn } from "@/lib/utils";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "security", label: "Security" },
  { key: "preferences", label: "Preferences" },
  { key: "data", label: "Data & Privacy" },
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
    "w-full h-11 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200 appearance-none cursor-pointer";

  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-6 py-8 md:px-10">
      {/* Page Header */}
      <Reveal>
        <div className="mb-8">
          <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-on-surface)]">
            {t("settings.title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            {t("settings.subtitle")}
          </p>
        </div>
      </Reveal>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Sidebar Tabs */}
        <Reveal className="w-full lg:w-56 shrink-0">
          <nav className="rounded-xl border border-[var(--color-outline-variant)] bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  activeTab === tab.key
                    ? "bg-[var(--color-surface-container-low)] text-[var(--color-primary)] font-semibold"
                    : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-lowest)] hover:text-[var(--color-on-surface)]"
                )}
              >
                {tab.key === "profile" && <User className="h-4 w-4 shrink-0" />}
                {tab.key === "security" && <Lock className="h-4 w-4 shrink-0" />}
                {tab.key === "preferences" && <Settings className="h-4 w-4 shrink-0" />}
                {tab.key === "data" && <Shield className="h-4 w-4 shrink-0" />}
                {tab.label}
              </button>
            ))}
          </nav>
        </Reveal>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <Reveal>
              <div className="rounded-xl border border-[var(--color-outline-variant)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)]">
                <h2 className="text-xl font-semibold text-[var(--color-on-surface)] mb-1">
                  {t("settings.profile.heading")}
                </h2>
                <div className="h-px bg-[var(--color-outline-variant)] mb-6" />

                {/* Avatar row */}
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative">
                    <img
                      src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/8a491caa8a6441ba85389563111320e5.jpg"
                      alt="Profile avatar"
                      className="h-20 w-20 rounded-full object-cover ring-2 ring-[var(--color-outline-variant)]"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div
                      className="h-20 w-20 rounded-full bg-[var(--color-primary)] items-center justify-center text-white text-2xl font-bold ring-2 ring-[var(--color-outline-variant)]"
                      style={{ display: "none" }}
                    >
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-on-surface)]">
                      {t("settings.profile.avatarLabel")}
                    </p>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                      {t("settings.profile.avatarHint")}
                    </p>
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-1.5">
                      {t("settings.profile.fullName")}
                    </label>
                    <input
                      className={inputClass}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-1.5">
                      {t("settings.profile.email")}
                    </label>
                    <input
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      type="email"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={handleProfileSave}
                    className="h-10 px-5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t("settings.saveChanges")}
                  </button>
                  {profileSaved && (
                    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                      <Check className="h-4 w-4" />
                      {t("settings.saved")}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === "security" && (
            <Reveal>
              <div className="rounded-xl border border-[var(--color-outline-variant)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-on-surface)] mb-1">
                    {t("settings.security.heading")}
                  </h2>
                  <div className="h-px bg-[var(--color-outline-variant)] mb-6" />

                  {/* 2FA toggle */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-on-surface)]">
                        {t("settings.security.twoFa")}
                      </p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                        {t("settings.security.twoFaDesc")}
                      </p>
                    </div>
                    <button
                      onClick={() => setTwoFaEnabled((v) => !v)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                        twoFaEnabled ? "bg-[var(--color-primary)]" : "bg-[var(--color-outline-variant)]"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
                          twoFaEnabled ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Change Password */}
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-on-surface)] mb-4">
                    {t("settings.security.changePassword")}
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: t("settings.security.currentPassword"), value: currentPw, setter: setCurrentPw, show: showCurrentPw, toggle: () => setShowCurrentPw((v) => !v) },
                      { label: t("settings.security.newPassword"), value: newPw, setter: setNewPw, show: showNewPw, toggle: () => setShowNewPw((v) => !v) },
                      { label: t("settings.security.confirmPassword"), value: confirmPw, setter: setConfirmPw, show: showConfirmPw, toggle: () => setShowConfirmPw((v) => !v) },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-1.5">
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            type={field.show ? "text" : "password"}
                            className={inputClass + " pr-10"}
                            value={field.value}
                            onChange={(e) => field.setter(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={field.toggle}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
                          >
                            {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {pwError && (
                    <p className="mt-3 text-sm text-red-500 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" />
                      {pwError}
                    </p>
                  )}
                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={handlePasswordSave}
                      className="h-10 px-5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      {t("settings.security.updatePassword")}
                    </button>
                    {pwSaved && (
                      <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                        <Check className="h-4 w-4" />
                        {t("settings.saved")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* ── PREFERENCES TAB ── */}
          {activeTab === "preferences" && (
            <Reveal>
              <div className="rounded-xl border border-[var(--color-outline-variant)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-on-surface)] mb-1">
                    {t("settings.preferences.heading")}
                  </h2>
                  <div className="h-px bg-[var(--color-outline-variant)] mb-6" />

                  <div className="space-y-5">
                    {/* Currency */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-1.5">
                        {t("settings.preferences.currency")}
                      </label>
                      <select
                        className={selectClass}
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        {CURRENCIES.map((c: { value: string; label: string }) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Theme */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-1.5">
                        {t("settings.preferences.theme")}
                      </label>
                      <select
                        className={selectClass}
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                      >
                        {THEMES.map((th: { value: string; label: string }) => (
                          <option key={th.value} value={th.value}>
                            {th.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Monthly Budget */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-1.5">
                        {t("settings.preferences.monthlyBudget")}
                      </label>
                      <input
                        className={inputClass}
                        type="number"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(e.target.value)}
                        placeholder="3000"
                      />
                    </div>

                    {/* Notifications */}
                    <div>
                      <p className="text-sm font-medium text-[var(--color-on-surface)] mb-3">
                        {t("settings.preferences.notifications")}
                      </p>
                      <div className="space-y-3">
                        {[
                          { label: t("settings.preferences.emailNotif"), value: emailNotif, setter: setEmailNotif },
                          { label: t("settings.preferences.pushNotif"), value: pushNotif, setter: setPushNotif },
                        ].map((notif) => (
                          <div key={notif.label} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-outline-variant)]">
                            <span className="text-sm text-[var(--color-on-surface)]">{notif.label}</span>
                            <button
                              onClick={() => notif.setter((v) => !v)}
                              className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                                notif.value ? "bg-[var(--color-primary)]" : "bg-[var(--color-outline-variant)]"
                              )}
                            >
                              <span
                                className={cn(
                                  "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
                                  notif.value ? "translate-x-6" : "translate-x-1"
                                )}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrefSave}
                    className="h-10 px-5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t("settings.saveChanges")}
                  </button>
                  {prefSaved && (
                    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                      <Check className="h-4 w-4" />
                      {t("settings.saved")}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          )}

          {/* ── DATA & PRIVACY TAB ── */}
          {activeTab === "data" && (
            <Reveal>
              <div className="rounded-xl border border-[var(--color-outline-variant)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-on-surface)] mb-1">
                    {t("settings.data.heading")}
                  </h2>
                  <div className="h-px bg-[var(--color-outline-variant)] mb-6" />

                  {/* Export */}
                  <div className="p-4 rounded-lg border border-[var(--color-outline-variant)] flex items-start gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Download className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-on-surface)]">
                        {t("settings.data.exportTitle")}
                      </p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                        {t("settings.data.exportDesc")}
                      </p>
                      <button
                        onClick={handleExportCSV}
                        className="mt-3 h-9 px-4 rounded-lg border border-[var(--color-outline-variant)] text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-lowest)] transition-colors"
                      >
                        {t("settings.data.exportBtn")}
                      </button>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="p-4 rounded-lg border border-red-200 bg-red-50 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-red-700">
                        {t("settings.data.deleteTitle")}
                      </p>
                      <p className="text-xs text-red-500 mt-0.5">
                        {t("settings.data.deleteDesc")}
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="mt-3 h-9 px-4 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                      >
                        {t("settings.data.deleteBtn")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-on-surface)]">
                {t("settings.data.deleteModal.title")}
              </h3>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
              {t("settings.data.deleteModal.desc")}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-1.5">
                {t("settings.data.deleteModal.confirmLabel")}
              </label>
              <input
                className={inputClass}
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={t("settings.data.deleteModal.placeholder")}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
                className="flex-1 h-10 rounded-lg border border-[var(--color-outline-variant)] text-sm font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-lowest)] transition-colors"
              >
                {t("settings.data.deleteModal.cancel")}
              </button>
              <button
                disabled={deleteConfirm !== "DELETE"}
                className="flex-1 h-10 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("settings.data.deleteModal.confirm")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
