const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

let accessToken = null;

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const setAccessToken = (token) => {
  accessToken = token;
};

const request = async (path, options = {}) => {
  const headers = new Headers(options.headers);
  if (accessToken && path.startsWith("/api/admin/")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  if (options.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      payload.error?.message || "The request could not be completed.",
      response.status,
      payload.error?.details,
    );
  }
  return payload;
};

const queryString = (params = {}) => {
  const search = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );
  const value = search.toString();
  return value ? `?${value}` : "";
};

export const api = {
  auth: {
    login: (credentials) => request("/api/admin/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
    refresh: () => request("/api/admin/auth/refresh", { method: "POST" }),
    logout: () => request("/api/admin/auth/logout", { method: "POST" }),
    me: () => request("/api/admin/auth/me"),
  },
  admin: {
    products: (params) => request(`/api/admin/products${queryString(params)}`),
    createProduct: (product) => request("/api/admin/products", { method: "POST", body: JSON.stringify(product) }),
    adjustStock: (id, delta) => request(`/api/admin/products/${id}/stock`, { method: "PATCH", body: JSON.stringify({ delta }) }),
    deleteProduct: (id) => request(`/api/admin/products/${id}`, { method: "DELETE" }),
    orders: (params) => request(`/api/admin/orders${queryString(params)}`),
    order: (code) => request(`/api/admin/orders/${encodeURIComponent(code)}`),
    createOrder: (order) => request("/api/admin/orders", { method: "POST", body: JSON.stringify(order) }),
    updateOrderStatus: (code, status) => request(`/api/admin/orders/${encodeURIComponent(code)}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    events: (params) => request(`/api/admin/events${queryString(params)}`),
    createEvent: (event) => request("/api/admin/events", { method: "POST", body: JSON.stringify(event) }),
    event: (slug) => request(`/api/admin/events/${encodeURIComponent(slug)}`),
    addRegistrant: (slug, registrant) => request(`/api/admin/events/${encodeURIComponent(slug)}/registrants`, { method: "POST", body: JSON.stringify(registrant) }),
    deleteRegistrant: (slug, registrantId) => request(`/api/admin/events/${encodeURIComponent(slug)}/registrants/${registrantId}`, { method: "DELETE" }),
    subscribers: (params) => request(`/api/admin/mail-club${queryString(params)}`),
    updateSubscriberStatus: (id, status) => request(`/api/admin/mail-club/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },
  store: {
    products: (params) => request(`/api/store/products${queryString(params)}`),
    product: (id) => request(`/api/store/products/${id}`),
    events: () => request("/api/store/events"),
    event: (slug) => request(`/api/store/events/${encodeURIComponent(slug)}`),
    register: (slug, registration) => request(`/api/store/events/${encodeURIComponent(slug)}/register`, { method: "POST", body: JSON.stringify(registration) }),
    subscribe: (subscriber) => request("/api/store/mail-club/subscribe", { method: "POST", body: JSON.stringify(subscriber) }),
  },
};

export const normalizeStatus = (status) => status?.toLowerCase();
export const asNumber = (value) => Number(value || 0);
export const formatDate = (value) => value ? new Date(value).toLocaleDateString() : "-";