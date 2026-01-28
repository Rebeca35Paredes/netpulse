import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function AdminBoard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadIncidencias();
  }, []);

  async function loadIncidencias() {
    try {
      const res = await apiFetch("/incidencias");
      setData(res || []);
    } catch (err) {
      console.error(err);
      setError("Error cargando incidencias");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      {/* HEADER SIEMPRE VISIBLE */}
      <div className="page-header page-header-left">
        <h1>Panel administrador</h1>
        <p>
          Vista general de todos los técnicos, clientes atendidos y estado de
          las incidencias.
        </p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID incidencia</th>
              <th>Técnico</th>
              <th>Cliente</th>
              <th>Incidencia</th>
              <th>Estado</th>
              <th>Última actualización</th>
            </tr>
          </thead>

          <tbody>
            {/* LOADING */}
            {loading && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Cargando incidencias...
                </td>
              </tr>
            )}

            {/* ERROR */}
            {!loading && error && (
              <tr>
                <td colSpan="6" className="error" style={{ textAlign: "center" }}>
                  {error}
                </td>
              </tr>
            )}

            {/* SIN DATOS */}
            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No hay incidencias registradas
                </td>
              </tr>
            )}

            {/* DATOS */}
            {!loading &&
              !error &&
              data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.tecnico || "Sin asignar"}</td>
                  <td>{row.cliente}</td>
                  <td>{row.titulo}</td>
                  <td>
                    <span
                      className={`estado estado-${row.estado
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {row.estado}
                    </span>
                  </td>
                  <td>{row.fecha}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
