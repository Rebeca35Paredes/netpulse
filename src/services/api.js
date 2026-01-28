import { API_URL } from "../config";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  // 👇 manejar respuestas SIN body
  let data = null;
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  }

  if (!res.ok) {
    throw new Error(data?.error || "Error en la petición");
  }

  return data;
}

