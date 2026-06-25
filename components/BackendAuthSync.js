"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { setAuthUser, syncBackendToken } from "@/lib/backendAuth";
import { getBackendToken } from "@/lib/dashboard/api";

/**
 * Keeps Express JWT in sync whenever a Better Auth session exists.
 */
export default function BackendAuthSync() {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setAuthUser(null);
      return;
    }

    setAuthUser(session.user);

    if (getBackendToken()) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await syncBackendToken(session.user);
      } catch (error) {
        if (!cancelled) {
          console.error("Backend auth sync failed:", error);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user, isPending]);

  return null;
}
