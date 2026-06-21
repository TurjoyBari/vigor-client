import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";

    if (typeof window !== "undefined" && error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

/** User dashboard */
export const userApi = {
  getOverview: () => api.get("/user/overview"),
  getBookedClasses: () => api.get("/user/booked-classes"),
  getFavorites: () => api.get("/user/favorites"),
  removeFavorite: (id) => api.delete(`/user/favorites/${id}`),
  applyTrainer: (data) => api.post("/user/apply-trainer", data),
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.patch("/user/profile", data),
};

/** Trainer dashboard */
export const trainerApi = {
  getOverview: () => api.get("/trainer/overview"),
  getClasses: () => api.get("/trainer/classes"),
  createClass: (data) => api.post("/trainer/classes", data),
  updateClass: (id, data) => api.patch(`/trainer/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/trainer/classes/${id}`),
  getClassStudents: (id) => api.get(`/trainer/classes/${id}/students`),
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
  getTrainerApplications: () => api.get("/admin/trainer-applications"),
  reviewTrainerApplication: (id, data) =>
    api.patch(`/admin/trainer-applications/${id}`, data),
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
