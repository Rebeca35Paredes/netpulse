// src/pages/Services.jsx
export default function Services() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>Nuestros Servicios</h1>
        <p>Funcionalidades claves de la plataforma</p>
      </div>

      <div className="three-columns">
        <div className="card service-card">
          <div className="service-icon">🛠️</div>
          <h3>Gestión de incidencias</h3>
          <p>Nuestro sistema permite registrar problemas de forma sencilla y garantiza que sean asignados al técnico adecuado para su pronta resolución.</p>
        </div>

        <div className="card service-card">
          <div className="service-icon">🔍</div>
          <h3>Seguimiento en línea</h3>
          <p>Podrás ver el progreso, los técnicos asignados y las actualizaciones en tiempo real, manteniendo siempre la transparencia del proceso.</p>
        </div>

        <div className="card service-card">
          <div className="service-icon">📊</div>
          <h3>Reportes personalizados</h3>
          <p>Accede a reportes claros y detallados sobre el historial de incidencias, tiempos de respuesta y desempeño técnico.</p>
        </div>
      </div>
    </section>
  );
}
