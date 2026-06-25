import { createAuthClient } from "better-auth/react";

/**
 * Auth API is always on the same Next.js app (/api/auth).
 * In the browser, always use the current origin — never a baked localhost URL.
 */
function resolveAuthBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return (
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL?.trim()?.replace(/\/$/, "") ||
    process.env.BETTER_AUTH_URL?.trim()?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
  );
}

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseURL(),
  fetchOptions: {
    credentials: "include",
  },
});

export const { signUp, signIn, signOut, useSession } = authClient;

export function getAuthUserFromResult(result) {
  return result?.data?.user ?? null;
}

export function getAuthErrorMessage(
  error,
  fallback = "Sign in failed. Please try again."
) {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  return (
    error.message ||
    error.statusText ||
    error.code ||
    fallback
  );
}
