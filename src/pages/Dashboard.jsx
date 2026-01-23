import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    abiertas: 0,
    sinAsignar: 0,
    usuariosActivos: 0,
  });

  const [recientes, setRecientes] = useState([]);
  useEffect(() => {
    apiFetch("http://localhost:4000/api/incidencias/stats")
      .then(setStats)
      .catch((err) => console.error("Error cargando stats:", err));

    apiFetch("http://localhost:4000/api/incidencias/recientes")
      .then(setRecientes)
      .catch((err) =>
        console.error("Error cargando incidencias recientes:", err)
      );
  }, []);

  return (
    <section className="page">
      <div className="page-header page-header-left">
        <h1>Dashboard</h1>
      </div>

      {/* TARJETAS DE RESUMEN */}
      <div className="dashboard-top">
        <div className="stats-row">
          <div className="stat-card stat-blue">
            <span className="stat-label">Total de incidencias abiertas</span>
            <span className="stat-value">{stats.abiertas}</span>
          </div>

          <div className="stat-card stat-yellow">
            <span className="stat-label">Incidencias sin asignar</span>
            <span className="stat-value">{stats.sinAsignar}</span>
          </div>

          <div className="stat-card stat-green">
            <span className="stat-label">Total de usuarios activos</span>
            <span className="stat-value">{stats.usuariosActivos}</span>
          </div>
        </div>

        {/* ALERTAS (A futuro podemos hacerlas dinámicas) */}
        <div className="alerts-panel">
          <h3>Alertas recientes</h3>
          <div className="alert-tag alert-yellow">
            Lorem ipsum, Lorem ipsum Lorem ipsum.
          </div>
          <div className="alert-tag alert-red">
            Lorem ipsum, Lorem ipsum Lorem ipsum.
          </div>
        </div>
      </div>

      {/* TABLA DE INCIDENTES RECIENTES */}
      <h3 className="section-title">Incidencias activas recientes</h3>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Prioridad</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {recientes.map((inc) => (
              <tr key={inc.id}>
                <td>{inc.id}</td>
                <td>{inc.titulo}</td>
                <td>{inc.prioridad}</td>
                <td>{inc.fecha}</td>
                <td>{inc.estado}</td>
                <td>
                  <button className="btn-small">Ver detalles</button>
                </td>
              </tr>
            ))}

            {/* FILLERS VISUALES */}
            {Array.from({ length: Math.max(0, 6 - recientes.length) }).map(
              (_, i) => (
                <tr key={`empty-${i}`}>
                  <td colSpan="6">&nbsp;</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
