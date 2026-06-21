"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import {
  canAccessDashboardRoute,
  getRoleDashboardPath,
  DASHBOARD_ROLES,
} from "@/lib/dashboard/navConfig";

/**
 * Protects dashboard routes with Better Auth session + role checks.
 *
 * @example
 * // In app/dashboard/layout.js
 * <RoleGuard>{children}</RoleGuard>
 *
 * @example
 * // Restrict to specific roles
 * <RoleGuard allowedRoles={["admin"]}>{children}</RoleGuard>
 */
export default function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user;
  const userRole = user?.role;

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      toast.error("Please sign in to access the dashboard.");
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.isBlocked) {
      toast.error("Your account has been blocked. Contact support.");
      router.replace("/");
      return;
    }

    const normalizedRole = DASHBOARD_ROLES.includes(userRole) ? userRole : "user";

    if (!canAccessDashboardRoute(normalizedRole, pathname)) {
      toast.error("You do not have permission to access that page.");
      router.replace(getRoleDashboardPath(normalizedRole));
      return;
    }

    if (allowedRoles?.length && !allowedRoles.includes(normalizedRole)) {
      toast.error("This area is restricted to authorized roles only.");
      router.replace(getRoleDashboardPath(normalizedRole));
    }
  }, [isPending, user, userRole, pathname, router, allowedRoles]);

  if (isPending) {
    return fallback || <LoadingSkeleton variant="page" />;
  }

  if (!user) {
    return fallback || <LoadingSkeleton variant="page" />;
  }

  if (user.isBlocked) {
    return fallback || <LoadingSkeleton variant="page" />;
  }

  const normalizedRole = DASHBOARD_ROLES.includes(userRole) ? userRole : "user";

  if (!canAccessDashboardRoute(normalizedRole, pathname)) {
    return fallback || <LoadingSkeleton variant="page" />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(normalizedRole)) {
    return fallback || <LoadingSkeleton variant="page" />;
  }

  return children;
}
