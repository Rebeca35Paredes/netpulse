import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function TechnicianBoard() {
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadAssigned();
  }, []);

  /* =========================
     CARGAR INCIDENCIAS ASIGNADAS
  ========================== */
  async function loadAssigned() {
    try {
      const data = await apiFetch("/incidencias/mis-asignadas");
      setAssigned(data);
    } catch (err) {
      console.error("Error cargando incidencias:", err);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     ACTUALIZAR ESTADO
  ========================== */
  async function updateEstado(id, estado) {
    setUpdatingId(id);

    try {
      await apiFetch(`/incidencias/${id}/estado`, {
        method: "PUT",
        body: JSON.stringify({ estado }),
      });

      loadAssigned();
    } catch (err) {
      alert(err.error || "Error actualizando estado");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <p className="page">Cargando incidencias...</p>;
  }

  return (
    <section className="page">
      <div className="page-header page-header-left">
        <h1>Panel del técnico</h1>
        <p>
          Lista de incidencias asignadas al técnico. Vista pensada para gestión diaria.
        </p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Incidencia</th>
              <th>Prioridad</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {assigned.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.cliente}</td>
                <td>{row.titulo}</td>
                <td>{row.prioridad}</td>
                <td>{row.fecha}</td>

                <td>
                  <span
                    className={`estado estado-${row.estado
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {row.estado}
                  </span>
                </td>

                <td>
                  <select
                    disabled={updatingId === row.id}
                    value={row.estado}
                    onChange={(e) =>
                      updateEstado(row.id, e.target.value)
                    }
                  >
                    <option value="Asignada">Asignada</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Resuelta">Resuelta</option>
                  </select>
                </td>
              </tr>
            ))}

            {assigned.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No tienes incidencias asignadas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
