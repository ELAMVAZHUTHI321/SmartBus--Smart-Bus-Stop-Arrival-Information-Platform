export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
export const BASE_URL = import.meta.env.VITE_API_URL || "/api";
export const TOKEN_KEY = "sb_token";

export const delay = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms));

export async function httpRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}