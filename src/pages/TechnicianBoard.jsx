import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { apiFetch } from "../services/api";

export default function TechnicianBoard() {
  const { user } = useContext(AuthContext);
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    if (!user) return;

    apiFetch("http://localhost:4000/api/incidencias")
      .then(setAssigned)
      .catch(err => console.error(err));
  }, [user]);

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
                <td>{row.estado}</td>
                <td>
                  <button className="btn-small">Actualizar</button>
                </td>
              </tr>
            ))}

            {/* Relleno visual */}
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={"empty-" + i}>
                <td colSpan="7">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
