import { API_URL } from "../config";
import { apiFetch } from "./api";

export const getIncidencias = () =>
  apiFetch("/incidencias");

export const getStats = () =>
  apiFetch("/incidencias/stats");

export const asignarTecnico = (incidenciaId, tecnico_id) =>
  apiFetch(`/incidencias/${incidenciaId}/asignar`, {
    method: "PUT",
    body: JSON.stringify({ tecnico_id })
  });
