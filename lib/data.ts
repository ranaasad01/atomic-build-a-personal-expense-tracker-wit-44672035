export const BRAND = {
  name: "SpendWise",
  tagline: "Personal Finance",
  description: "Take control of every dollar you spend.",
} as const;

export interface NavLink {
  label: string;
  href: string;
  key: string;
  icon?: string;
  appOnly?: boolean;
  signup?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Dashboard", href: "/dashboard", key: "dashboard", icon: "dashboard", appOnly: true },
  { label: "Transactions", href: "/transactions", key: "transactions", icon: "receipt_long", appOnly: true },
  { label: "Categories", href: "/categories", key: "categories", icon: "category", appOnly: true },
  { label: "Reports", href: "/reports", key: "reports", icon: "bar_chart", appOnly: true },
  { label: "Budget", href: "/budget", key: "budget", icon: "account_balance_wallet", appOnly: true },
  { label: "Settings", href: "/settings", key: "settings", icon: "settings", appOnly: true },
];

export const publicNavLinks: NavLink[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "Sign In", href: "/auth", key: "signin" },
  { label: "Sign Up", href: "/signup", key: "signup" },
];

// ─── Shared Types ────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  user_id?: string | null;
  created_at?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category_id: string | null;
  date: string;
  description: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface UserSettings {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  default_currency: string;
  theme: string;
  monthly_budget: number | null;
  email_notifications: boolean;
  push_notifications: boolean;
  two_fa_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface MonthlySummary {
  month: string;
  totalSpend: number;
  income: number;
  netSavings: number;
}

// ─── Category Defaults ───────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-housing", name: "Housing", color: "#4f46e5", icon: "home", user_id: null },
  { id: "cat-food", name: "Food & Drink", color: "#f59e0b", icon: "restaurant", user_id: null },
  { id: "cat-transport", name: "Transport", color: "#10b981", icon: "directions_car", user_id: null },
  { id: "cat-groceries", name: "Groceries", color: "#6366f1", icon: "shopping_cart", user_id: null },
  { id: "cat-software", name: "Software", color: "#3730a3", icon: "computer", user_id: null },
  { id: "cat-travel", name: "Travel", color: "#f97316", icon: "flight", user_id: null },
  { id: "cat-health", name: "Healthcare", color: "#ec4899", icon: "favorite", user_id: null },
  { id: "cat-entertainment", name: "Entertainment", color: "#8b5cf6", icon: "movie", user_id: null },
  { id: "cat-other", name: "Other", color: "#94a3b8", icon: "more_horiz", user_id: null },
];

// ─── Currency Options ─────────────────────────────────────────────────────────

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "AUD", label: "AUD (A$)" },
];

export const THEME_OPTIONS = [
  { value: "light", label: "Light (System Default)" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
