"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import { useVigorRole } from "@/lib/hooks/useVigorRole";
import { getRoleDashboardPath } from "@/lib/dashboard/navConfig";

/**
 * /dashboard — redirects to the correct role dashboard home.
 */
export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, role, loading } = useVigorRole();

  useEffect(() => {
    if (loading) return;

    const target = user
      ? getRoleDashboardPath(role)
      : "/login?callbackUrl=%2Fdashboard";

    router.replace(target);
  }, [loading, user, role, router]);

  return <LoadingSkeleton variant="page" />;
}
