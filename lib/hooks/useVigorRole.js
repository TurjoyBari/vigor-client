"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { syncBackendToken } from "@/lib/publicApi";
import { DASHBOARD_ROLES } from "@/lib/dashboard/navConfig";

function resolveClientRole(vigorUser, sessionUser) {
  const roles = [vigorUser?.role, sessionUser?.role].filter(Boolean);

  if (roles.includes("admin")) return "admin";

  if (
    roles.includes("trainer") ||
    vigorUser?.trainerApplicationStatus === "approved"
  ) {
    return "trainer";
  }

  return "user";
}

/**
 * Resolve dashboard role from VIGOR MongoDB users collection (source of truth).
 * Re-syncs on route changes so admin approvals are picked up without re-login.
 */
export function useVigorRole() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [role, setRole] = useState("user");
  const [vigorUser, setVigorUser] = useState(null);
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setRole("user");
      setVigorUser(null);
      setResolving(false);
      return;
    }

    let cancelled = false;
    setResolving(true);

    (async () => {
      try {
        const authData = await syncBackendToken(session.user);
        const syncedUser = authData?.user;

        console.log("VIGOR user role:", syncedUser?.role);
        console.log("Better Auth user role:", session.user.role);
        console.log("Trainer application status:", syncedUser?.trainerApplicationStatus);

        const effectiveRole = resolveClientRole(syncedUser, session.user);

        if (!cancelled) {
          setVigorUser(syncedUser);
          setRole(
            DASHBOARD_ROLES.includes(effectiveRole) ? effectiveRole : "user"
          );
        }
      } catch (error) {
        console.error("Failed to resolve VIGOR role:", error);
        const fallback = resolveClientRole(null, session.user);
        if (!cancelled) {
          setVigorUser(null);
          setRole(DASHBOARD_ROLES.includes(fallback) ? fallback : "user");
        }
      } finally {
        if (!cancelled) setResolving(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user, isPending, pathname]);

  return {
    session,
    user: session?.user,
    vigorUser,
    role,
    loading: isPending || resolving,
  };
}
