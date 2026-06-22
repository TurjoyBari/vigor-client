"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { ChartLine } from "@gravity-ui/icons";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import {
  cn,
  dashboardClasses,
  CHART_COLORS,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

function formatChartValue(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`;
  return String(num);
}

function getAccentColor(accent) {
  if (accent === "primary") return CHART_COLORS.primary;
  if (accent === "accent") return CHART_COLORS.accent;
  return CHART_COLORS.secondary;
}

function BarChart({ data = [], height = 220, accent = "secondary" }) {
  const maxValue = Math.max(...data.map((item) => Number(item.value) || 0), 1);
  const defaultColor = getAccentColor(accent);

  return (
    <div className="w-full">
      <div
        className="relative flex items-end justify-between gap-1.5 sm:gap-2 border-b border-primary-container/15 pb-3"
        style={{ height }}
        role="img"
        aria-label="Bar chart"
      >
        {[0.25, 0.5, 0.75].map((ratio) => (
          <div
            key={ratio}
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-primary-container/10"
            style={{ bottom: `${ratio * 100}%` }}
          />
        ))}

        {data.map((item, index) => {
          const value = Number(item.value) || 0;
          const pct = Math.max((value / maxValue) * 100, 4);
          const color = item.color || defaultColor;

          return (
            <div
              key={item.label || index}
              className="relative z-10 flex h-full flex-1 flex-col items-center justify-end min-w-0 gap-2"
            >
              <span className="font-geist-label text-[10px] sm:text-xs font-semibold text-white tabular-nums">
                {formatChartValue(value)}
              </span>
              <motion.div
                className="w-full max-w-[44px] mx-auto rounded-t-md"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 18px ${color}55`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
              />
            </div>
          );
        })}
      </div>

      <div
        className="mt-3 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
      >
        {data.map((item, index) => (
          <p
            key={item.label || index}
            className="font-hanken text-[11px] text-on-surface-variant text-center truncate"
          >
            {item.label}
          </p>
        ))}
      </div>
    </div>
  );
}

function LineChart({ data = [], height = 220, accent = "secondary" }) {
  const gradientId = useId().replace(/:/g, "");
  const maxValue = Math.max(...data.map((item) => Number(item.value) || 0), 1);
  const strokeColor = getAccentColor(accent);

  const chartWidth = 640;
  const chartHeight = height - 36;
  const padX = 20;
  const padY = 18;
  const innerW = chartWidth - padX * 2;
  const innerH = chartHeight - padY * 2;

  const points = data.map((item, index) => {
    const value = Number(item.value) || 0;
    const x =
      data.length === 1
        ? chartWidth / 2
        : padX + (index / (data.length - 1)) * innerW;
    const y = padY + (1 - value / maxValue) * innerH;
    return { x, y, value, label: item.label };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - 8} L ${points[0].x} ${chartHeight - 8} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        width="100%"
        height={chartHeight}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
        role="img"
        aria-label="Line chart"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((ratio) => {
          const y = padY + ratio * innerH;
          return (
            <line
              key={ratio}
              x1={padX}
              y1={y}
              x2={chartWidth - padX}
              y2={y}
              stroke={CHART_COLORS.grid}
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          );
        })}

        <line
          x1={padX}
          y1={chartHeight - 8}
          x2={chartWidth - padX}
          y2={chartHeight - 8}
          stroke={CHART_COLORS.grid}
          strokeWidth="1"
        />

        <motion.path
          d={areaPath}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        />

        {points.map((point, index) => (
          <g key={point.label || index}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={strokeColor}
              fillOpacity="0.2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + index * 0.08 }}
            />
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#0B1120"
              stroke={strokeColor}
              strokeWidth="2.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.08 }}
            />
          </g>
        ))}
      </svg>

      <div className="mt-3 flex items-start justify-between gap-2">
        {data.map((item, index) => (
          <div key={item.label || index} className="flex-1 min-w-0 text-center">
            <p className="font-hanken text-[11px] text-on-surface-variant truncate">
              {item.label}
            </p>
            <p className="font-geist-label text-xs font-semibold text-white mt-0.5 tabular-nums">
              {formatChartValue(item.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Analytics chart card for trainer/admin dashboards.
 *
 * @example
 * <AnalyticsCard
 *   title="Enrollment Analytics"
 *   type="bar"
 *   data={[
 *     { label: "Jan", value: 24 },
 *     { label: "Feb", value: 38 },
 *   ]}
 * />
 */
export default function AnalyticsCard({
  title,
  subtitle,
  data = [],
  type = "bar",
  loading = false,
  icon = ChartLine,
  accent = "secondary",
  footer,
  className = "",
  height = 220,
  action,
}) {
  const accentClass =
    accent === "primary"
      ? "text-primary bg-primary-container/15"
      : accent === "accent"
        ? "text-[#FF6B00] bg-[#FF6B00]/15"
        : "text-secondary bg-secondary/15";

  if (loading) {
    return <LoadingSkeleton variant="card" className={cn("min-h-[320px]", className)} />;
  }

  return (
    <motion.article
      className={cn(
        dashboardClasses.glassCard,
        dashboardClasses.glassCardHover,
        "p-5 md:p-6",
        className
      )}
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={DASHBOARD_ANIMATION.fadeIn.transition}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {icon && (
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                accentClass
              )}
            >
              <Icon icon={icon} size={22} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-anybody text-lg font-bold text-white truncate">{title}</h3>
            {subtitle && (
              <p className="mt-1 font-hanken text-sm text-on-surface-variant">{subtitle}</p>
            )}
          </div>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      {data.length ? (
        type === "line" ? (
          <LineChart data={data} height={height} accent={accent} />
        ) : (
          <BarChart data={data} height={height} accent={accent} />
        )
      ) : (
        <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-primary-container/20 bg-primary-container/5">
          <p className="font-hanken text-sm text-on-surface-variant">No chart data available</p>
        </div>
      )}

      {footer && (
        <div className="mt-5 border-t border-primary-container/10 pt-4">{footer}</div>
      )}
    </motion.article>
  );
}
