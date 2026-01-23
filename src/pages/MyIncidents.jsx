import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { apiFetch } from "../services/api";

export default function MyIncidents() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    if (!user) return;

    apiFetch("http://localhost:4000/api/incidencias")
      .then(setIncidents)
      .catch(err => console.error("Error cargando incidencias:", err));
  }, [user]);
  
  return (
    <section className="page">
      <div className="page-header page-header-left">
        <div
          className="headerRow"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            width: "100%",
          }}
        >
          <div style={{ flex: "0 1 auto" }}>
            <h1>Mis incidencias reportadas</h1>
            <p>
              Aquí puedes ver el estado de los reportes que has realizado y el
              técnico asignado.
            </p>
          </div>

          <button
            className="btn-primary user-create-btn"
            onClick={() => navigate("/reportar-incidencia")}
            style={{ marginLeft: "auto" }}
          >
            + Reportar incidencia
          </button>
        </div>
      </div>

      <div className="incident-list">
        {incidents.map((inc) => (
          <article key={inc.id} className="incident-card">
            <header className="incident-header">
              <div>
                <h3>{inc.titulo}</h3>
                <p className="incident-id-fecha">
                  ID: <span>{inc.id}</span> • Fecha:{" "}
                  <span>{inc.fecha}</span>
                </p>
              </div>

              <span
                className={
                  "status-badge " +
                  (inc.estado === "Cerrada"
                    ? "status-closed"
                    : inc.estado === "Pendiente"
                    ? "status-pending"
                    : "status-in-progress")
                }
              >
                {inc.estado}
              </span>
            </header>

            <p className="incident-resumen">{inc.resumen}</p>

            <footer className="incident-footer">
              <div>
                <span className="incident-label">Técnico asignado</span>
                <span className="incident-value">
                  {inc.tecnico || "Sin asignar"}
                </span>
              </div>

              <button
                className="btn-primary"
                onClick={() => setSelectedIncident(inc)}
              >
                Ver detalle
              </button>
            </footer>
          </article>
        ))}

        {incidents.length === 0 && (
          <p>No tienes incidencias registradas por el momento.</p>
        )}
      </div>

      {/* ----------------------- MODAL ----------------------- */}
      {selectedIncident && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedIncident(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedIncident.titulo}</h2>

            <p className="modal-id-fecha">
              <strong>ID:</strong> {selectedIncident.id} •{" "}
              <strong>Fecha:</strong> {selectedIncident.fecha}
            </p>

            <p className="modal-detalle">{selectedIncident.descripcion}</p>

            <p className="modal-tecnico">
              <strong>Técnico asignado:</strong>{" "}
              {selectedIncident.tecnico || "Sin asignar"}
            </p>

            <button
              className="btn-primary modal-close"
              onClick={() => setSelectedIncident(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
