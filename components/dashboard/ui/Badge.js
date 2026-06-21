"use client";

import { motion } from "framer-motion";
import { BADGE_VARIANTS, dashboardClasses, cn } from "@/lib/dashboard/theme";
import { STATUS_BADGE_MAP } from "@/lib/dashboard/navConfig";

const SIZE_CLASSES = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

/**
 * Reusable status / role badge for dashboard UI.
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge status="pending" />
 * <Badge role="trainer" />
 */
export default function Badge({
  children,
  variant = "default",
  status,
  role,
  size = "md",
  dot = false,
  animated = true,
  className = "",
}) {
  let label = children;
  let resolvedVariant = variant;

  if (status && STATUS_BADGE_MAP[status]) {
    label = label || STATUS_BADGE_MAP[status].label;
    resolvedVariant = STATUS_BADGE_MAP[status].variant;
  }

  if (role) {
    const roleLabels = {
      user: "Member",
      trainer: "Trainer",
      admin: "Admin",
    };
    const roleVariants = {
      user: "default",
      trainer: "secondary",
      admin: "accent",
    };
    label = label || roleLabels[role] || role;
    resolvedVariant = roleVariants[role] || "default";
  }

  const badgeClasses = cn(
    dashboardClasses.badge,
    BADGE_VARIANTS[resolvedVariant] || BADGE_VARIANTS.default,
    SIZE_CLASSES[size],
    className
  );

  const content = (
    <>
      {dot && (
        <span
          className={cn(
            "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
            resolvedVariant === "success" && "bg-[#22C55E]",
            resolvedVariant === "danger" && "bg-error",
            resolvedVariant === "warning" && "bg-[#F59E0B]",
            resolvedVariant === "secondary" && "bg-secondary",
            resolvedVariant === "accent" && "bg-[#FF6B00]",
            resolvedVariant === "primary" && "bg-primary",
            resolvedVariant === "default" && "bg-outline"
          )}
        />
      )}
      {label}
    </>
  );

  if (!animated) {
    return <span className={badgeClasses}>{content}</span>;
  }

  return (
    <motion.span
      className={badgeClasses}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.04 }}
    >
      {content}
    </motion.span>
  );
}
