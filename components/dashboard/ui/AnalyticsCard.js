"use client";

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

function BarChart({ data = [], height = 220 }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const barWidth = 100 / Math.max(data.length, 1);

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Bar chart"
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 78;
          const x = index * barWidth + barWidth * 0.18;
          const width = barWidth * 0.64;
          const y = 88 - barHeight;

          return (
            <g key={item.label || index}>
              <motion.rect
                x={x}
                y={88}
                width={width}
                height={0}
                rx={1.5}
                fill={item.color || CHART_COLORS.primary}
                fillOpacity={0.85}
                animate={{ height: barHeight, y }}
                transition={{ duration: 0.6, delay: index * 0.06, ease: "easeOut" }}
              />
            </g>
          );
        })}

        <line
          x1="0"
          y1="88"
          x2="100"
          y2="88"
          stroke={CHART_COLORS.grid}
          strokeWidth="0.4"
        />
      </svg>

      <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((item, index) => (
          <div key={item.label || index} className="text-center min-w-0">
            <p className="font-hanken text-[11px] text-on-surface-variant truncate">
              {item.label}
            </p>
            <p className="font-geist-label text-xs font-semibold text-white mt-0.5">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ data = [], height = 220 }) {
  if (!data.length) return null;

  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const points = data.map((item, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * 100;
    const y = 88 - (item.value / maxValue) * 78;
    return `${x},${y}`;
  });

  const areaPoints = `0,88 ${points.join(" ")} 100,88`;
  const polylinePoints = points.join(" ");

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Line chart"
      >
        <defs>
          <linearGradient id="analyticsLineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.secondary} stopOpacity="0.35" />
            <stop offset="100%" stopColor={CHART_COLORS.secondary} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[22, 44, 66].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke={CHART_COLORS.grid}
            strokeWidth="0.35"
          />
        ))}

        <motion.polygon
          points={areaPoints}
          fill="url(#analyticsLineGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.polyline
          points={polylinePoints}
          fill="none"
          stroke={CHART_COLORS.secondary}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {data.map((item, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * 100;
          const y = 88 - (item.value / maxValue) * 78;
          return (
            <motion.circle
              key={item.label || index}
              cx={x}
              cy={y}
              r="1.8"
              fill={CHART_COLORS.secondary}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.08 }}
            />
          );
        })}
      </svg>

      <div className="mt-3 flex items-center justify-between gap-2">
        {data.map((item, index) => (
          <div key={item.label || index} className="text-center flex-1 min-w-0">
            <p className="font-hanken text-[11px] text-on-surface-variant truncate">
              {item.label}
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
          <LineChart data={data} height={height} />
        ) : (
          <BarChart data={data} height={height} />
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
