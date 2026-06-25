import axios from "axios";
import {
  clearBackendToken,
  getBackendToken,
  setBackendToken,
  setTokenRefreshHandler,
} from "@/lib/dashboard/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/** Bare client for /auth/token — no interceptors (avoids deadlock). */
const authBootstrapClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let currentAuthUser = null;
let syncInFlight = null;

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null;
}

/** Register Better Auth user for automatic JWT attachment on API calls. */
export function setAuthUser(user) {
  currentAuthUser = user || null;
  if (!user) {
    clearBackendToken();
  }
}

export function getCurrentAuthUser() {
  return currentAuthUser;
}

/**
 * Sync Better Auth session → Express JWT and store for Authorization header.
 */
export async function syncBackendToken(user, { force = false } = {}) {
  if (!user?.email) {
    setAuthUser(null);
    return null;
  }

  currentAuthUser = user;

  if (!force && getBackendToken()) {
    try {
      const meResponse = await authBootstrapClient.get("/auth/me", {
        headers: { Authorization: `Bearer ${getBackendToken()}` },
      });
      const meData = unwrap(meResponse);
      if (meData?.user) {
        return { token: getBackendToken(), user: meData.user };
      }
    } catch {
      // Token invalid/expired — fall through to full sync.
    }
  }

  if (syncInFlight) {
    return syncInFlight;
  }

  syncInFlight = (async () => {
    const response = await authBootstrapClient.post("/auth/token", {
      userId: user.id,
      email: user.email,
      name: user.name || user.email.split("@")[0] || "VIGOR User",
      role: user.role || "user",
      image: user.image ?? null,
    });

    const data = unwrap(response);
    const token = data?.token;

    if (!token) {
      throw new Error("Backend did not return an auth token");
    }

    setBackendToken(token);
    return data;
  })();

  try {
    return await syncInFlight;
  } finally {
    syncInFlight = null;
  }
}

/**
 * Ensure a backend JWT exists before protected API calls.
 */
export async function ensureBackendAuth(user, options) {
  if (!user?.email) {
    throw new Error("Authentication required");
  }

  currentAuthUser = user;

  if (getBackendToken() && !options?.force) {
    return getBackendToken();
  }

  if (syncInFlight) {
    await syncInFlight;
    return getBackendToken();
  }

  await syncBackendToken(user, options);
  return getBackendToken();
}

setTokenRefreshHandler(async () => {
  if (!currentAuthUser) return false;

  try {
    clearBackendToken();
    await syncBackendToken(currentAuthUser, { force: true });
    return Boolean(getBackendToken());
  } catch {
    return false;
  }
});

export { clearBackendToken, getBackendToken, setBackendToken };
