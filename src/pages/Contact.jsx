// src/pages/Contact.jsx
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio.";
    if (!form.mensaje.trim()) newErrors.mensaje = "El mensaje es obligatorio.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSent(true);
    // aquí podrías hacer fetch a tu backend
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1>Contáctanos</h1>
        <p>Estamos aquí para ayudarte, déjanos tus datos y mensaje.</p>
      </div>

      <div className="contact-grid">
        <form className="card contact-form" onSubmit={handleSubmit} noValidate>
          <label>
            Nombre
            <input
              name="nombre"
              type="text"
              placeholder="Ingresa tu nombre"
              value={form.nombre}
              onChange={handleChange}
              className={errors.nombre ? "input-error" : ""}
            />
            {errors.nombre && (
              <div className="field-error">{errors.nombre}</div>
            )}
          </label>

          <label>
            Teléfono
            <input
              name="telefono"
              type="tel"
              placeholder="Ingresa tu teléfono"
              value={form.telefono}
              onChange={handleChange}
              className={errors.telefono ? "input-error" : ""}
            />
            {errors.telefono && (
              <div className="field-error">{errors.telefono}</div>
            )}
          </label>

          <label>
            Mensaje
            <textarea
              name="mensaje"
              rows="4"
              placeholder="Escribe tu mensaje"
              value={form.mensaje}
              onChange={handleChange}
              className={errors.mensaje ? "textarea-error" : ""}
            />
            {errors.mensaje && (
              <div className="field-error">{errors.mensaje}</div>
            )}
          </label>

          <button type="submit" className="btn-primary">
            Enviar
          </button>

          {sent && (
            <p className="success-text">
              ¡Gracias! Hemos recibido tu mensaje.
            </p>
          )}
        </form>

        <div className="card contact-info">
          <h3>Nuestra información</h3>

          <div className="info-row">
            <span className="info-icon">📞</span>
            <p>Teléfono: +58 (212) 500-1234</p>
          </div>

          <div className="info-row">
            <span className="info-icon">✉️</span>
            <p>Email: soporte@netpulse.com</p>
          </div>

          <div className="info-row">
            <span className="info-icon">📍</span>
            <p>Dirección: Av. Principal de Chacao, Torre Connecta, Piso 7, Caracas, Venezuela</p>
          </div>
        </div>
      </div>
    </section>
  );
}
