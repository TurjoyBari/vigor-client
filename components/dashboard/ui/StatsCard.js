"use client";

import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
  STAT_ACCENT_COLORS,
} from "@/lib/dashboard/theme";

/**
 * Animated analytics stat card for dashboard overview pages.
 *
 * @example
 * <StatsCard
 *   title="Total Booked Classes"
 *   value={12}
 *   icon={Calendar}
 *   accent="primary"
 *   trend={{ value: 8, label: "vs last month" }}
 * />
 */
export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  accent = "primary",
  trend,
  loading = false,
  className = "",
  index = 0,
  onClick,
}) {
  const accentStyles = STAT_ACCENT_COLORS[accent] || STAT_ACCENT_COLORS.primary;
  const isPositiveTrend = trend?.value >= 0;

  return (
    <motion.article
      className={cn(
        dashboardClasses.glassCard,
        dashboardClasses.glassCardHover,
        "p-5 md:p-6 relative overflow-hidden group",
        onClick && "cursor-pointer",
        className
      )}
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={{ ...DASHBOARD_ANIMATION.fadeIn.transition, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-container/10 blur-2xl transition-opacity group-hover:opacity-80"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-geist-label text-label-sm uppercase tracking-widest text-on-surface-variant truncate">
            {title}
          </p>

          {loading ? (
            <div className="mt-3 h-9 w-24 animate-pulse rounded-lg bg-primary-container/15" />
          ) : (
            <p className="mt-2 font-anybody text-3xl md:text-4xl font-bold text-white tracking-tight">
              {value}
            </p>
          )}

          {subtitle && !loading && (
            <p className="mt-1 font-hanken text-sm text-on-surface-variant">{subtitle}</p>
          )}

          {trend && !loading && (
            <div className="mt-3 flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                  isPositiveTrend
                    ? "bg-[#22C55E]/15 text-[#22C55E]"
                    : "bg-error/15 text-error"
                )}
              >
                {isPositiveTrend ? "+" : ""}
                {trend.value}%
              </span>
              {trend.label && (
                <span className="font-hanken text-xs text-on-surface-variant">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              accentStyles.bg,
              accentStyles.glow
            )}
          >
            <Icon icon={icon} className={accentStyles.text} size={24} />
          </div>
        )}
      </div>
    </motion.article>
  );
}
