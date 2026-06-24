import api from "@/lib/dashboard/api";

/**
 * Unwrap VIGOR API response: { success, message, data } → data
 */
export function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null;
}

/**
 * Sync Better Auth session → Express JWT (HTTPOnly cookie).
 * Call after login or when protected public routes need backend auth.
 */
export async function syncBackendToken(user) {
  if (!user?.email) return null;

  const response = await api.post("/auth/token", {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role || "user",
    image: user.image ?? null,
  });

  return unwrap(response);
}

/** Classes — public catalog */
export const classesApi = {
  /** Approved/published classes only */
  getApproved: (params = {}) => api.get("/classes/approved", { params }),

  /** Top featured classes by booking count */
  getFeatured: (params = {}) => api.get("/classes/featured", { params }),

  /** Search + filter: ?search=&category=&difficulty= */
  getAll: (params = {}) => api.get("/classes", { params }),

  getById: (id) => api.get(`/classes/${id}`),
};

/** Bookings — authenticated */
export const bookingsApi = {
  check: (classId) =>
    api.get("/bookings/check", { params: { classId } }),

  create: (classId) => api.post("/bookings", { classId }),

  getMine: () => api.get("/bookings/my"),

  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
};

/** Favorites — authenticated */
export const favoritesApi = {
  check: (classId) =>
    api.get("/favorites/check", { params: { classId } }),

  getAll: () => api.get("/favorites"),

  getUserFavorites: (userId) => api.get(`/favorites/user/${userId}`),

  add: (classId) => api.post("/favorites", { classId }),

  remove: (id) => api.delete(`/favorites/${id}`),

  removeByClassId: (classId) => api.delete(`/favorites/${classId}`),
};

/** Forum — public read, authenticated interactions */
export const forumApi = {
  getPosts: (params = {}) => api.get("/forum/posts", { params }),

  getPostById: (id) => api.get(`/forum/posts/${id}`),

  likePost: (id) => api.post(`/forum/posts/${id}/like`),

  dislikePost: (id) => api.post(`/forum/posts/${id}/dislike`),

  addComment: (postId, content) =>
    api.post(`/forum/posts/${postId}/comments`, { content }),

  replyComment: (commentId, content) =>
    api.post(`/forum/comments/${commentId}/reply`, { content }),

  editComment: (commentId, content) =>
    api.patch(`/forum/comments/${commentId}`, { content }),

  deleteComment: (commentId) =>
    api.delete(`/forum/comments/${commentId}`),
};

/** Payments — Stripe Checkout + MongoDB payments collection */
export const paymentsApi = {
  createCheckoutSession: (classId) =>
    api.post("/payments/create-checkout-session", { classId }),

  getCheckoutSession: (sessionId) =>
    api.get(`/payments/session/${sessionId}`),

  /** Current user's payments from MongoDB payments collection only */
  getMine: () => api.get("/payments/my"),

  getUserPayments: (userId) => api.get(`/payments/user/${userId}`),
};

/** Combined public API surface */
const publicApi = {
  classes: classesApi,
  bookings: bookingsApi,
  favorites: favoritesApi,
  forum: forumApi,
  payments: paymentsApi,
  syncBackendToken,
  unwrap,
};

export default publicApi;
