import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const BACKEND_TOKEN_KEY = "vigor_backend_token";

/** In-memory cache (sessionStorage is source of truth in browser). */
let cachedBackendToken = null;

export function getBackendToken() {
  if (cachedBackendToken) return cachedBackendToken;
  if (typeof window === "undefined") return null;
  cachedBackendToken = sessionStorage.getItem(BACKEND_TOKEN_KEY);
  return cachedBackendToken;
}

export function setBackendToken(token) {
  cachedBackendToken = token || null;
  if (typeof window === "undefined") return;
  if (token) {
    sessionStorage.setItem(BACKEND_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(BACKEND_TOKEN_KEY);
  }
}

export function clearBackendToken() {
  setBackendToken(null);
}

let tokenRefreshHandler = null;

export function setTokenRefreshHandler(handler) {
  tokenRefreshHandler = handler;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getBackendToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Clear stored JWT and backend session cookie (best-effort).
 */
export async function logoutBackend() {
  clearBackendToken();
  try {
    await api.post("/auth/logout");
  } catch {
    // Cookie may be blocked cross-origin; local token clear is enough.
  }
}

/**
 * Unwrap VIGOR API response: { success, message, data } → data
 */
export function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (
      error.response?.status === 401 &&
      config &&
      !config._authRetry &&
      tokenRefreshHandler
    ) {
      config._authRetry = true;
      try {
        const refreshed = await tokenRefreshHandler();
        if (refreshed) {
          const token = getBackendToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return api(config);
        }
      } catch {
        // Fall through to normal error handling.
      }
    }

    console.log(error.response);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";

    const isTimeout =
      error.code === "ECONNABORTED" ||
      /timeout/i.test(String(error.message || ""));

    const isPublicRead =
      config?.method?.toUpperCase() === "GET" &&
      /\/classes\/(approved|featured)|\/forum\/posts/.test(config?.url || "");

    if (typeof window !== "undefined" && error.response?.status === 401) {
      if (config?._authRetry) {
        toast.error("Session expired. Please log in again.");
      }
    } else if (typeof window !== "undefined" && isTimeout && !isPublicRead) {
      toast.error("Server is slow to respond. Please try again.");
    } else if (typeof window !== "undefined" && isTimeout && isPublicRead) {
      // Public catalog reads fail quietly — components show their own empty states.
    } else if (typeof window !== "undefined" && error.response?.status !== 401) {
      if (
        error.response?.status === 403 &&
        message === "Action restricted by Admin"
      ) {
        toast.error("Action restricted by Admin");
      } else {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

/** Trainer classes — MongoDB classes collection */
export const trainerClassesApi = {
  /** POST /api/trainer/classes — trainer creates class (status: pending) */
  create: async (data) => {
    console.log("API Request: POST /trainer/classes", data);
    const response = await api.post("/trainer/classes", data);
    console.log("API Response: POST /trainer/classes", response?.data);
    return response;
  },
  getAll: () => api.get("/trainer/classes"),
  update: (id, data) => api.patch(`/trainer/classes/${id}`, data),
  remove: (id) => api.delete(`/trainer/classes/${id}`),
  getStudents: (id) => api.get(`/trainer/classes/${id}/students`),
};

/** Trainer applications — MongoDB trainerApplications collection */
export const trainerApplicationsApi = {
  submit: (data) => api.post("/trainer-applications", data),
  getByUserId: (userId) => api.get(`/trainer-applications/user/${userId}`),
  getAll: () => api.get("/trainer-applications"),
  approve: (id) => api.patch(`/trainer-applications/${id}/approve`),
  reject: (id, feedback) =>
    api.patch(`/trainer-applications/${id}/reject`, { feedback }),
};

/** User dashboard */
export const userApi = {
  getOverview: () => api.get("/user/overview"),
  getBookedClasses: () => api.get("/user/booked-classes"),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
  getFavorites: () => api.get("/user/favorites"),
  removeFavorite: (id) => api.delete(`/user/favorites/${id}`),
  applyTrainer: (data) => trainerApplicationsApi.submit(data),
  getTrainerApplication: (userId) => trainerApplicationsApi.getByUserId(userId),
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.patch("/user/profile", data),
};

/** Trainer dashboard */
export const trainerApi = {
  getOverview: () => api.get("/trainer/overview"),
  getClasses: () => trainerClassesApi.getAll(),
  createClass: (data) => trainerClassesApi.create(data),
  updateClass: (id, data) => trainerClassesApi.update(id, data),
  deleteClass: (id) => trainerClassesApi.remove(id),
  getClassStudents: (id) => trainerClassesApi.getStudents(id),
  getForumPosts: () => api.get("/trainer/forum-posts"),
  createForumPost: (data) => api.post("/trainer/forum-posts", data),
  deleteForumPost: (id) => api.delete(`/trainer/forum-posts/${id}`),
  getProfile: () => api.get("/trainer/profile"),
  updateProfile: (data) => api.patch("/trainer/profile", data),
};

/** Admin dashboard */
export const adminApi = {
  getOverview: () => api.get("/admin/overview"),
  getUsers: () => api.get("/admin/users"),
  blockUser: (id) => api.patch(`/admin/users/${id}/block`),
  unblockUser: (id) => api.patch(`/admin/users/${id}/unblock`),
  promoteUser: (id) => api.patch(`/admin/users/${id}/promote`),
  getTrainerApplications: () => trainerApplicationsApi.getAll(),
  reviewTrainerApplication: (id, data) =>
    api.patch(`/admin/trainer-applications/${id}`, data),
  approveTrainerApplication: (id) => trainerApplicationsApi.approve(id),
  rejectTrainerApplication: (id, feedback) =>
    trainerApplicationsApi.reject(id, feedback),
  getTrainers: () => api.get("/admin/trainers"),
  demoteTrainer: (id) => api.patch(`/admin/trainers/${id}/demote`),
  getClasses: () => api.get("/admin/classes"),
  approveClass: (id) => api.patch(`/admin/classes/${id}/approve`),
  rejectClass: (id) => api.patch(`/admin/classes/${id}/reject`),
  deleteClass: (id) => api.delete(`/admin/classes/${id}`),
  getTransactions: () => api.get("/admin/transactions"),
  getForumPosts: () => api.get("/admin/forum-posts"),
  createForumPost: (data) => api.post("/admin/forum-posts", data),
  deleteForumPost: (id) => api.delete(`/admin/forum-posts/${id}`),
  getProfile: () => api.get("/admin/profile"),
  updateProfile: (data) => api.patch("/admin/profile", data),
};

export default api;
