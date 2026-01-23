import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function AdminBoard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    apiFetch("http://localhost:4000/api/incidencias")
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="page">
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
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.tecnico || "Sin asignar"}</td>
                <td>{row.cliente}</td>
                <td>{row.titulo}</td>
                <td>{row.estado}</td>
                <td>{row.fecha}</td>
              </tr>
            ))}

            {/* Relleno visual */}
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={"empty-" + i}>
                <td colSpan="6">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
