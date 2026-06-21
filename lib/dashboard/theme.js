/**
 * VIGOR Dashboard Design System
 * Premium fitness analytics theme tokens + Tailwind class helpers
 */

export const DASHBOARD_COLORS = {
  primary: "#7C3AED",
  secondary: "#06B6D4",
  accent: "#FF6B00",
  success: "#22C55E",
  danger: "#EF4444",
  warning: "#F59E0B",
  background: "#0B1120",
  surface: "#15121B",
  surfaceElevated: "#1A1F2E",
  border: "rgba(124, 58, 237, 0.2)",
  borderSubtle: "rgba(255, 255, 255, 0.08)",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  glass: "rgba(15, 23, 42, 0.65)",
  glassBorder: "rgba(124, 58, 237, 0.15)",
};

export const DASHBOARD_RADIUS = {
  sm: "12px",
  md: "16px",
  lg: "20px",
  xl: "24px",
  full: "9999px",
};

export const DASHBOARD_SHADOWS = {
  card: "0 8px 32px rgba(0, 0, 0, 0.35)",
  cardHover: "0 12px 40px rgba(124, 58, 237, 0.15)",
  glow: "0 0 24px rgba(124, 58, 237, 0.35)",
  glowSecondary: "0 0 24px rgba(6, 182, 212, 0.25)",
  navbar: "0 4px 24px rgba(0, 0, 0, 0.25)",
};

export const DASHBOARD_SPACING = {
  sidebarWidth: "280px",
  sidebarCollapsedWidth: "80px",
  navbarHeight: "72px",
  contentPadding: "24px",
  contentPaddingLg: "32px",
};

export const DASHBOARD_ANIMATION = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  spring: { type: "spring", stiffness: 380, damping: 30 },
  fadeIn: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.25 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  },
  staggerContainer: {
    animate: { transition: { staggerChildren: 0.08 } },
  },
};

/** Reusable Tailwind class strings */
export const dashboardClasses = {
  page: "min-h-screen bg-[#0B1120] text-slate-100",

  shell: "flex min-h-screen bg-[#0B1120]",

  content: "flex-1 flex flex-col min-w-0",

  main: "flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto",

  glassCard: [
    "rounded-[20px]",
    "border border-primary-container/20",
    "bg-surface-container/60",
    "backdrop-blur-xl",
    "shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
  ].join(" "),

  glassCardHover: [
    "transition-all duration-300",
    "hover:border-secondary/30",
    "hover:shadow-[0_12px_40px_rgba(124,58,237,0.15)]",
  ].join(" "),

  sidebar: [
    "fixed lg:sticky top-0 left-0 z-40 h-screen",
    "border-r border-primary-container/20",
    "bg-[#0B1120]/95 backdrop-blur-xl",
    "flex flex-col",
  ].join(" "),

  navbar: [
    "sticky top-0 z-30 h-[72px]",
    "border-b border-primary-container/20",
    "bg-[#0B1120]/80 backdrop-blur-xl",
    "px-4 md:px-6 lg:px-8",
    "flex items-center justify-between gap-4",
  ].join(" "),

  input: [
    "w-full rounded-xl",
    "bg-surface-container-low/80",
    "border border-primary-container/20",
    "px-4 py-3 text-sm text-on-surface",
    "placeholder:text-outline-variant",
    "focus:outline-none focus:border-primary-container/50",
    "transition-colors duration-200",
  ].join(" "),

  select: [
    "w-full rounded-xl",
    "bg-surface-container-low/80",
    "border border-primary-container/20",
    "px-4 py-3 text-sm text-on-surface",
    "focus:outline-none focus:border-primary-container/50",
    "transition-colors duration-200",
    "cursor-pointer",
  ].join(" "),

  btnPrimary: [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl px-5 py-2.5",
    "bg-primary-container text-on-primary-container",
    "font-geist-label text-label-bold uppercase tracking-wider",
    "shadow-[0_0_20px_rgba(124,58,237,0.35)]",
    "hover:brightness-110 active:scale-[0.98]",
    "transition-all duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),

  btnSecondary: [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl px-5 py-2.5",
    "bg-surface-container-low border border-primary-container/25",
    "text-on-surface font-geist-label text-label-bold",
    "hover:border-secondary/40 hover:bg-primary-container/10",
    "active:scale-[0.98] transition-all duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),

  btnDanger: [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl px-5 py-2.5",
    "bg-error/15 border border-error/30 text-error",
    "font-geist-label text-label-bold",
    "hover:bg-error/25 active:scale-[0.98]",
    "transition-all duration-200",
  ].join(" "),

  btnGhost: [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl px-4 py-2",
    "text-on-surface-variant hover:text-on-surface",
    "hover:bg-primary-container/10",
    "transition-all duration-200",
  ].join(" "),

  tableWrapper: [
    "rounded-[20px] overflow-hidden",
    "border border-primary-container/20",
    "bg-surface-container/40 backdrop-blur-xl",
  ].join(" "),

  tableHead: "bg-primary-container/10 text-on-surface-variant text-xs uppercase tracking-wider",

  tableRow: "border-b border-primary-container/10 hover:bg-primary-container/5 transition-colors",

  pageTitle: "font-anybody text-2xl md:text-3xl font-bold text-white tracking-tight",

  pageSubtitle: "font-hanken text-sm text-on-surface-variant mt-1",

  sectionTitle: "font-geist-label text-label-bold uppercase tracking-widest text-on-surface-variant",

  badge: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",

  gridStats: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6",

  gridCards: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
};

/** Badge color variants mapped to Tailwind classes */
export const BADGE_VARIANTS = {
  default: "bg-surface-container-high text-on-surface-variant border border-primary-container/20",
  primary: "bg-primary-container/20 text-primary border border-primary-container/30",
  secondary: "bg-secondary/15 text-secondary border border-secondary/30",
  accent: "bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30",
  success: "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30",
  danger: "bg-error/15 text-error border border-error/30",
  warning: "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30",
};

/** Stats card accent colors for icon backgrounds */
export const STAT_ACCENT_COLORS = {
  primary: {
    bg: "bg-primary-container/20",
    text: "text-primary",
    glow: "shadow-[0_0_20px_rgba(124,58,237,0.2)]",
  },
  secondary: {
    bg: "bg-secondary/15",
    text: "text-secondary",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.2)]",
  },
  accent: {
    bg: "bg-[#FF6B00]/15",
    text: "text-[#FF6B00]",
    glow: "shadow-[0_0_20px_rgba(255,107,0,0.2)]",
  },
  success: {
    bg: "bg-[#22C55E]/15",
    text: "text-[#22C55E]",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]",
  },
  danger: {
    bg: "bg-error/15",
    text: "text-error",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.2)]",
  },
};

/** Chart placeholder colors */
export const CHART_COLORS = {
  primary: DASHBOARD_COLORS.primary,
  secondary: DASHBOARD_COLORS.secondary,
  accent: DASHBOARD_COLORS.accent,
  grid: "rgba(148, 163, 184, 0.1)",
  axis: DASHBOARD_COLORS.textMuted,
};

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
