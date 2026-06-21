"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import {
  DASHBOARD_ROLES,
  getRoleDashboardPath,
} from "@/lib/dashboard/navConfig";

/**
 * /dashboard — redirects to the correct role dashboard home.
 */
export default function DashboardIndexPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    const role = session?.user?.role;
    const target = DASHBOARD_ROLES.includes(role)
      ? getRoleDashboardPath(role)
      : "/login?callbackUrl=%2Fdashboard";

    router.replace(target);
  }, [isPending, session, router]);

  return <LoadingSkeleton variant="page" />;
}
