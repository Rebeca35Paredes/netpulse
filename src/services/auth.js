import { API_URL } from "../config";
import { apiFetch } from "./api";

export const login = (credentials) =>
  apiFetch(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials)
  });

export function recoverAccount(email) {
  return apiFetch("/auth/recover", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}