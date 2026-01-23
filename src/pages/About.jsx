// src/pages/About.jsx
export default function About() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>Sobre Nosotros</h1>
        <p>
          Conoce el Propósito y Visión de <span className="link-text">NetPulse</span>
        </p>
      </div>

      <div className="two-columns">
        <div className="card">
          <h3>Nuestros Propósito</h3>
          <p>
            En Pulse trabajamos con un propósito claro: simplificar y mejorar la forma en que los usuarios reciben soporte técnico.
          </p>
          <p>
            Nuestra plataforma ha sido diseñada para ofrecer un servicio accesible, confiable y centrado en las personas.
          </p>
        </div>

        <div className="card">
          <h3>Nuestra Visión</h3>
          <p>
            Aspiramos a convertirnos en la plataforma de referencia en la gestión de soporte técnico y seguimiento de incidencias.
          </p>
          <p>
            Nuestra visión es construir un servicio innovador que impulse la eficiencia, la transparencia y la confianza en cada interacción.
          </p>
        </div>
      </div>
    </section>
  );
}
