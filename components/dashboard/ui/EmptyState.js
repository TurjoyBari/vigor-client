"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { FolderOpen, Magnifier, Calendar, Star, Comment } from "@gravity-ui/icons";
import {
  cn,
  dashboardClasses,
  DASHBOARD_ANIMATION,
} from "@/lib/dashboard/theme";

const PRESET_CONFIG = {
  default: {
    icon: FolderOpen,
    title: "No data found",
    description: "There is nothing to show here yet.",
  },
  search: {
    icon: Magnifier,
    title: "No results found",
    description: "Try adjusting your search or filters.",
  },
  classes: {
    icon: Calendar,
    title: "No classes yet",
    description: "You have not booked any classes. Browse available sessions to get started.",
  },
  favorites: {
    icon: Star,
    title: "No favorites saved",
    description: "Save classes you love and they will appear here.",
  },
  posts: {
    icon: Comment,
    title: "No forum posts",
    description: "Create your first post to engage with the community.",
  },
};

/**
 * Empty state placeholder for dashboard lists and grids.
 *
 * @example
 * <EmptyState preset="classes" actionHref="/classes" actionLabel="Browse Classes" />
 */
export default function EmptyState({
  preset = "default",
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  className = "",
  compact = false,
}) {
  const presetData = PRESET_CONFIG[preset] || PRESET_CONFIG.default;
  const IconComponent = icon || presetData.icon;
  const displayTitle = title || presetData.title;
  const displayDescription = description || presetData.description;

  return (
    <motion.div
      className={cn(
        dashboardClasses.glassCard,
        "flex flex-col items-center justify-center text-center",
        compact ? "p-8 md:p-10" : "p-10 md:p-14",
        className
      )}
      initial={DASHBOARD_ANIMATION.scaleIn.initial}
      animate={DASHBOARD_ANIMATION.scaleIn.animate}
      transition={DASHBOARD_ANIMATION.scaleIn.transition}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/15 shadow-[0_0_24px_rgba(124,58,237,0.15)]">
        <Icon icon={IconComponent} className="text-primary" size={32} />
      </div>

      <h3 className="font-anybody text-xl md:text-2xl font-bold text-white">
        {displayTitle}
      </h3>

      <p className="mt-2 max-w-md font-hanken text-sm md:text-base text-on-surface-variant">
        {displayDescription}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {actionLabel && actionHref && (
            <Link href={actionHref} className={dashboardClasses.btnPrimary}>
              {actionLabel}
            </Link>
          )}

          {actionLabel && !actionHref && onAction && (
            <button type="button" onClick={onAction} className={dashboardClasses.btnPrimary}>
              {actionLabel}
            </button>
          )}

          {secondaryActionLabel && secondaryActionHref && (
            <Link href={secondaryActionHref} className={dashboardClasses.btnSecondary}>
              {secondaryActionLabel}
            </Link>
          )}

          {secondaryActionLabel && !secondaryActionHref && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className={dashboardClasses.btnSecondary}
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
