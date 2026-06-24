"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import { useVigorRole } from "@/lib/hooks/useVigorRole";
import {
  canAccessDashboardRoute,
  getRoleDashboardPath,
} from "@/lib/dashboard/navConfig";

/**
 * Protects dashboard routes using VIGOR MongoDB role (not stale Better Auth session).
 */
export default function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}) {
  const { user, role, loading } = useVigorRole();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error("Please sign in to access the dashboard.");
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!canAccessDashboardRoute(role, pathname)) {
      toast.error("You do not have permission to access that page.");
      router.replace(getRoleDashboardPath(role));
      return;
    }

    if (allowedRoles?.length && !allowedRoles.includes(role)) {
      toast.error("This area is restricted to authorized roles only.");
      router.replace(getRoleDashboardPath(role));
    }
  }, [loading, user, role, pathname, router, allowedRoles]);

  if (loading) {
    return fallback || <LoadingSkeleton variant="page" />;
  }

  if (!user) {
    return fallback || <LoadingSkeleton variant="page" />;
  }

  if (!canAccessDashboardRoute(role, pathname)) {
    return fallback || <LoadingSkeleton variant="page" />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return fallback || <LoadingSkeleton variant="page" />;
  }

  return children;
}
