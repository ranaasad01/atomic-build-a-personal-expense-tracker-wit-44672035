# AGENTS.md

Project conventions for AI agents and humans editing this codebase.

## Original request
Build a **Personal Expense Tracker** with authentication and a dashboard. Users can add, view, edit, and delete expenses with fields like amount, category, date, and description. Show the total expenses and category breakdown, and ensure each user's expenses remain private.

## Goal
Build SpendWise, a personal expense tracker SaaS with authentication, a sidebar-nav dashboard, full CRUD for expenses, donut chart category breakdown, spending trends, and per-user data privacy using Next.js 14, TypeScript, Tailwind CSS, and Recharts.

## Project type
saas-app

## Design system — match this exactly
- Color tokens: `--color-primary: #3525cd`, `--color-on-primary: #ffffff`, `--color-primary-container: #4f46e5`, `--color-on-primary-container: #dad7ff`, `--color-inverse-primary: #c3c0ff`, `--color-secondary: #006c49`, `--color-on-secondary: #ffffff`, `--color-secondary-container: #6cf8bb`, `--color-on-secondary-container: #00714d`, `--color-background: #f9f9ff`, `--color-on-background: #151c27`, `--foreground: 240 10% 3.9%`
- Fonts: Inter

## Existing components — reuse these, don't create near-duplicates
- AppLayout (components/AppLayout.tsx)
- Footer (components/Footer.tsx)
- LanguageToggle (components/LanguageToggle.tsx)
- LocaleProvider (components/LocaleProvider.tsx)
- Navbar (components/Navbar.tsx)
- Sidebar (components/Sidebar.tsx)

## Existing i18n namespaces
Every translation key must be namespaced (`hero.title`, never a bare `title`) so two components never collide on the same catalog slot. Reuse one of these, or pick a new, distinct name:
`addExpense`, `appBar`, `auth`, `categories`, `cta`, `dashboard`, `expenseForm`, `features`, `footer`, `hero`, `home`, `howItWorks`, `nav`, `reports`, `settings`, `sidebar`, `testimonials`, `transactions`, `trust`

When editing or adding pages: preserve the design system above, reuse existing components and the shared nav data file, and keep the established structure and tone.
