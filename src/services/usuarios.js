import { API_URL } from "../config";
import { apiFetch } from "./api";

export const getUsuarios = () =>
  apiFetch(`${API_URL}/usuarios`);

export const getTecnicos = () =>
  apiFetch(`${API_URL}/usuarios/tecnicos`);

export const crearUsuario = (data) =>
  apiFetch(`${API_URL}/usuarios`, {
    method: "POST",
    body: JSON.stringify(data)
  });

export const eliminarUsuario = (id) =>
  apiFetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE"
  });
