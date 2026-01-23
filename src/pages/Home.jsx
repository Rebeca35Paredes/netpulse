// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../App";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const handleReportClick = () => {
    // Por ahora siempre lleva a login
    // Si más adelante quieres cambiar:
    // navigate(isLoggedIn ? "/reportar-incidencia" : "/login");
    navigate("/login");
  };

  const handleAccessClick = () => {
    // Por ahora siempre lleva a login
    // Luego podrías usar: navigate(isLoggedIn ? "/dashboard" : "/login");
    navigate("/login");
  };

  return (
    <section className="page page-hero">
      <div className="hero-content">
        <h1>Soluciones de soporte para tu conexión</h1>
        <p>
          Soporte de incidencias, seguimientos en línea y reportes
          personalizados.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={handleReportClick}>
            + Reportar incidencia
          </button>
          <button className="btn-outline" onClick={handleAccessClick}>
            Acceder a mi cuenta
          </button>
        </div>

        <div className="cards-grid">
          <div className="card">
            <h3>Nuestros Servicios</h3>
            <p>
              En Pulse ofrecemos una plataforma ágil para gestionar incidencias técnicas, permitiendo reportar fallas, dar seguimiento en línea y recibir notificaciones en tiempo real. Facilitamos la comunicación entre clientes y técnicos para asegurar respuestas rápidas y un soporte transparente.
            </p>
          </div>
          <div className="card">
            <h3>Quiénes somos</h3>
            <p>
              Pulse es una solución tecnológica diseñada para mejorar la experiencia de soporte técnico. Nos enfocamos en ofrecer herramientas simples y eficientes que automatizan procesos y brindan trazabilidad y claridad en cada incidencia reportada.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
