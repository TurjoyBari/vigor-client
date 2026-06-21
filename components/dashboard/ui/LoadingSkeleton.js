"use client";

import { motion } from "framer-motion";
import { cn, dashboardClasses } from "@/lib/dashboard/theme";

function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-primary-container/10",
        className
      )}
    />
  );
}

function SkeletonCard({ className = "" }) {
  return (
    <div className={cn(dashboardClasses.glassCard, "p-5 md:p-6 space-y-4", className)}>
      <SkeletonBlock className="h-4 w-1/3" />
      <SkeletonBlock className="h-10 w-2/3" />
      <SkeletonBlock className="h-3 w-1/2" />
    </div>
  );
}

function SkeletonStatsGrid({ count = 4, className = "" }) {
  return (
    <div className={cn(dashboardClasses.gridStats, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.06 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
}

function SkeletonTable({ rows = 5, columns = 4, className = "" }) {
  return (
    <div className={cn(dashboardClasses.tableWrapper, "p-4 md:p-6", className)}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-10 w-32" />
      </div>
      <div className="space-y-3">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonBlock key={`head-${i}`} className="h-4 w-full" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 border-t border-primary-container/10 pt-3"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonBlock key={`cell-${rowIndex}-${colIndex}`} className="h-5 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonProfile({ className = "" }) {
  return (
    <div className={cn(dashboardClasses.glassCard, "p-6 md:p-8", className)}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <SkeletonBlock className="h-20 w-20 rounded-full shrink-0" />
        <div className="flex-1 w-full space-y-3 text-center sm:text-left">
          <SkeletonBlock className="h-6 w-40 mx-auto sm:mx-0" />
          <SkeletonBlock className="h-4 w-56 mx-auto sm:mx-0" />
          <SkeletonBlock className="h-6 w-24 mx-auto sm:mx-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function SkeletonGridCards({ count = 6, className = "" }) {
  return (
    <div className={cn(dashboardClasses.gridCards, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn(dashboardClasses.glassCard, "overflow-hidden")}>
          <SkeletonBlock className="h-40 w-full rounded-none rounded-t-[20px]" />
          <div className="p-4 space-y-3">
            <SkeletonBlock className="h-5 w-3/4" />
            <SkeletonBlock className="h-4 w-1/2" />
            <SkeletonBlock className="h-9 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonPage({ className = "" }) {
  return (
    <div className={cn("space-y-6 md:space-y-8", className)}>
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-64" />
        <SkeletonBlock className="h-4 w-96 max-w-full" />
      </div>
      <SkeletonStatsGrid count={4} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonTable rows={4} columns={4} />
        </div>
        <SkeletonProfile />
      </div>
    </div>
  );
}

const VARIANT_MAP = {
  block: SkeletonBlock,
  card: SkeletonCard,
  stats: SkeletonStatsGrid,
  table: SkeletonTable,
  profile: SkeletonProfile,
  grid: SkeletonGridCards,
  page: SkeletonPage,
};

/**
 * Flexible loading skeleton for dashboard pages.
 *
 * @example
 * <LoadingSkeleton variant="stats" count={4} />
 * <LoadingSkeleton variant="table" rows={6} columns={5} />
 * <LoadingSkeleton variant="page" />
 */
export default function LoadingSkeleton({
  variant = "card",
  count = 4,
  rows = 5,
  columns = 4,
  className = "",
}) {
  const Component = VARIANT_MAP[variant] || SkeletonCard;

  if (variant === "stats" || variant === "grid") {
    return <Component count={count} className={className} />;
  }

  if (variant === "table") {
    return <Component rows={rows} columns={columns} className={className} />;
  }

  if (variant === "block") {
    return <Component className={className} />;
  }

  return <Component className={className} />;
}

export {
  SkeletonBlock,
  SkeletonCard,
  SkeletonStatsGrid,
  SkeletonTable,
  SkeletonProfile,
  SkeletonGridCards,
  SkeletonPage,
};
