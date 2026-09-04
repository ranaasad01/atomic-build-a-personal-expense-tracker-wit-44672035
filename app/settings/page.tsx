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
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "JPY", label: "JPY (¥)" },
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
    "w-full h-11 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200 appearance-none cursor-pointer";

  return (
    <AppLayout pageTitle="Settings">
      <div className="min-h-screen bg-[var(--color-surface)] px-6 py-8">
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

        <div className="flex flex-col lg:flex-row gap-6 max-w-5xl">
          {/* Left Tab Panel */}
          <Reveal className="lg:w-56 shrink-0">
            <nav className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] overflow-hidden">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all duration-200 border-l-2",
                      isActive
                        ? "border-[var(--color-primary)] bg-[var(--color-surface-container-low)] text-[var(--color-primary)]"
                        : "border-transparent text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Reveal>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-on-surface)] mb-1">Profile Information</h2>
                  <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">Update your name, email, and profile photo.</p>

                  {/* Avatar Upload */}
                  <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[var(--color-outline-variant)]">
                    <div className="w-20 h-20 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center shrink-0 border-2 border-[var(--color-outline-variant)]">
                      <span className="text-2xl font-bold text-[var(--color-primary)]">
                        {fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-on-surface)] mb-1">{fullName}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mb-3">{email}</p>
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-[var(--color-outline-variant)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors">
                        <User className="h-3.5 w-3.5" />
                        Upload Photo
                        <input type="file" accept="image/*" className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">
                        Full Name
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
                      <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">
                        Email Address
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
                      className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-container)] transition-colors"
                    >
                      {profileSaved ? <Check className="h-4 w-4" /> : null}
                      {profileSaved ? "Saved!" : "Save Changes"}
                    </button>
                    {profileSaved && (
                      <span className="text-sm text-[var(--color-secondary)] font-medium">Profile updated successfully.</span>
                    )}
                  </div>
                </div>
              </Reveal>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <Reveal>
                <div className="space-y-5">
                  {/* Change Password */}
                  <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] p-6">
                    <h2 className="text-lg font-semibold text-[var(--color-on-surface)] mb-1">Change Password</h2>
                    <p className="text-sm text-[var(--color-on-surface-variant)] mb-5">Use a strong password of at least 8 characters.</p>

                    <div className="space-y-4">
                      {[
                        { label: "Current Password", value: currentPw, setter: setCurrentPw, show: showCurrentPw, toggle: () => setShowCurrentPw((v) => !v) },
                        { label: "New Password", value: newPw, setter: setNewPw, show: showNewPw, toggle: () => setShowNewPw((v) => !v) },
                        { label: "Confirm New Password", value: confirmPw, setter: setConfirmPw, show: showConfirmPw, toggle: () => setShowConfirmPw((v) => !v) },
                      ].map((field) => (
                        <div key={field.label}>
                          <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">
                            {field.label}
                          </label>
                          <div className="relative">
                            <input
                              type={field.show ? "text" : "password"}
                              value={field.value}
                              onChange={(e) => field.setter(e.target.value)}
                              className={cn(inputClass, "pr-10")}
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={field.toggle}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                            >
                              {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {pwError && (
                      <p className="mt-3 text-sm text-[var(--color-error)] flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {pwError}
                      </p>
                    )}

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={handlePasswordSave}
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-container)] transition-colors"
                      >
                        {pwSaved ? <Check className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        {pwSaved ? "Password Updated!" : "Update Password"}
                      </button>
                    </div>
                  </div>

                  {/* 2FA Toggle */}
                  <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-[var(--color-on-surface)]">Two-Factor Authentication</h3>
                        <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
                          Add an extra layer of security to your account.
                        </p>
                      </div>
                      <button
                        onClick={() => setTwoFaEnabled((v) => !v)}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                          twoFaEnabled ? "bg-[var(--color-primary)]" : "bg-[var(--color-outline-variant)]"
                        )}
                        role="switch"
                        aria-checked={twoFaEnabled}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200",
                            twoFaEnabled ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                    {twoFaEnabled && (
                      <p className="mt-3 text-xs text-[var(--color-secondary)] bg-[var(--color-secondary-container)]/20 rounded-lg px-3 py-2">
                        2FA is active. Your account is protected with an additional verification step.
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === "preferences" && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-on-surface)] mb-1">Preferences</h2>
                  <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">Customize your SpendWise experience.</p>

                  <div className="space-y-5">
                    {/* Currency */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">
                        Default Currency
                      </label>
                      <div className="relative">
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className={selectClass}
                        >
                          {CURRENCY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Theme */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">
                        Theme
                      </label>
                      <div className="relative">
                        <select
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                          className={selectClass}
                        >
                          {THEME_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Monthly Budget */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-1.5">
                        Monthly Budget (USD)
                      </label>
                      <input
                        type="number"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(e.target.value)}
                        className={inputClass}
                        placeholder="3000"
                        min="0"
                      />
                    </div>

                    {/* Notifications */}
                    <div className="pt-2 border-t border-[var(--color-outline-variant)]">
                      <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Notifications</p>
                      <div className="space-y-3">
                        {[
                          { label: "Email Notifications", desc: "Receive weekly spending summaries via email.", value: emailNotif, setter: setEmailNotif },
                          { label: "Push Notifications", desc: "Get alerts when you approach your budget limit.", value: pushNotif, setter: setPushNotif },
                        ].map((notif) => (
                          <label key={notif.label} className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-0.5">
                              <input
                                type="checkbox"
                                checked={notif.value}
                                onChange={(e) => notif.setter(e.target.checked)}
                                className="sr-only"
                              />
                              <div
                                className={cn(
                                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                  notif.value
                                    ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                                    : "border-[var(--color-outline-variant)] bg-white"
                                )}
                              >
                                {notif.value && <Check className="h-3 w-3 text-white" />}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[var(--color-on-surface)]">{notif.label}</p>
                              <p className="text-xs text-[var(--color-on-surface-variant)]">{notif.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={handlePrefSave}
                      className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-container)] transition-colors"
                    >
                      {prefSaved ? <Check className="h-4 w-4" /> : null}
                      {prefSaved ? "Saved!" : "Save Preferences"}
                    </button>
                    {prefSaved && (
                      <span className="text-sm text-[var(--color-secondary)] font-medium">Preferences saved.</span>
                    )}
                  </div>
                </div>
              </Reveal>
            )}

            {/* DATA & PRIVACY TAB */}
            {activeTab === "data" && (
              <Reveal>
                <div className="space-y-5">
                  {/* Export */}
                  <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] p-6">
                    <h2 className="text-lg font-semibold text-[var(--color-on-surface)] mb-1">Export Your Data</h2>
                    <p className="text-sm text-[var(--color-on-surface-variant)] mb-5">
                      Download a CSV file containing all your expense records. Your data belongs to you.
                    </p>
                    <button
                      onClick={handleExportCSV}
                      className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-outline-variant)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors shadow-sm"
                    >
                      <Download className="h-4 w-4" />
                      Export as CSV
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div className="bg-white rounded-2xl border border-[var(--color-danger)]/30 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03)] p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-[var(--color-error-container)] flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5 text-[var(--color-error)]" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[var(--color-error)]">Delete Account</h2>
                        <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                    </div>

                    {!showDeleteModal ? (
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-error)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete My Account
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <p className="text-sm font-medium text-[var(--color-on-surface)]">
                          Type <span className="font-mono font-bold text-[var(--color-error)]">DELETE</span> to confirm:
                        </p>
                        <input
                          type="text"
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          className={cn(inputClass, "border-[var(--color-error)]/40 focus:ring-[var(--color-error)]" )}
                          placeholder="Type DELETE to confirm"
                        />
                        <div className="flex items-center gap-3">
                          <button
                            disabled={deleteConfirm !== "DELETE"}
                            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-error)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
                            className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                          >
                            Cancel
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
