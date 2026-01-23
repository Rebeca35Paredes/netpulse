import { useState, useContext } from "react";
import { AuthContext } from "../App";

export default function ReportIssue() {
  const { user } = useContext(AuthContext);  // ← NECESARIO
  const [form, setForm] = useState({
    tipo: "",
    prioridad: "Media",
    descripcion: "",
    contrato: "",
    estadoInternet: "",
    lucesOnt: "",
    revisionCable: "",
  });

  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const e = {};
    if (!form.tipo.trim()) e.tipo = "Seleccione un tipo de incidencia.";
    if (!form.descripcion.trim())
      e.descripcion = "La descripción es obligatoria.";
    if (!form.estadoInternet.trim())
      e.estadoInternet = "Indique el estado del servicio.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:4000/api/incidencias/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: form.tipo,
          descripcion: form.descripcion,
          tipo: form.tipo,
          prioridad: form.prioridad,
          contrato: form.contrato,
          estadoInternet: form.estadoInternet,
          lucesOnt: form.lucesOnt,
          revisionCable: form.revisionCable,
          id_usuario: user.id
        }),
      });

      const data = await res.json();

      if (data.error) {
        setErrors({ general: data.error });
        return;
      }

      setSent(true);
    } catch (err) {
      console.error("Error enviando reporte:", err);
      setErrors({ general: "No se pudo enviar el reporte. Intente más tarde." });
    }
  };

  return (
    <section className="page">
      <div className="page-header page-header-center">
        <h1>Reportar incidencia técnica</h1>
      </div>

      <form className="card report-form" onSubmit={handleSubmit} noValidate>
        {/* Tipo de incidencia */}
        <h3 className="report-subtitle">Tipo de incidencia</h3>

        <select
          name="tipo"
          className={"input-light" + (errors.tipo ? " input-error" : "")}
          value={form.tipo}
          onChange={handleChange}
        >
          <option value="">Seleccione tipo de problema</option>
          <option>Corte de fibra</option>
          <option>Sin servicio</option>
          <option>Intermitente</option>
          <option>Internet lento</option>
        </select>
        {errors.tipo && <div className="field-error">{errors.tipo}</div>}

        {/* Estado del internet */}
        <select
          name="estadoInternet"
          className={
            "input-light" + (errors.estadoInternet ? " input-error" : "")
          }
          value={form.estadoInternet}
          onChange={handleChange}
        >
          <option value="">¿El servicio funciona?</option>
          <option>No tengo internet</option>
          <option>Funciona intermitente</option>
          <option>Funciona pero muy lento</option>
        </select>
        {errors.estadoInternet && (
          <div className="field-error">{errors.estadoInternet}</div>
        )}

        {/* Luces del router/ONT */}
        <select
          name="lucesOnt"
          className="input-light"
          value={form.lucesOnt}
          onChange={handleChange}
        >
          <option value="">Estado de las luces del equipo</option>
          <option>Todo normal</option>
          <option>Luz LOS encendida</option>
          <option>Luz PON parpadeando</option>
          <option>Power apagado</option>
        </select>

        {/* Revisión de cable */}
        <select
          name="revisionCable"
          className="input-light"
          value={form.revisionCable}
          onChange={handleChange}
        >
          <option value="">¿El cable está en buen estado?</option>
          <option>Sí, se ve bien</option>
          <option>No, está tirado o desconectado</option>
          <option>No estoy seguro</option>
        </select>

        {/* Descripción */}
        <textarea
          name="descripcion"
          className={
            "textarea-gray" + (errors.descripcion ? " textarea-error" : "")
          }
          rows="4"
          placeholder="Descripción del problema..."
          value={form.descripcion}
          onChange={handleChange}
        />
        {errors.descripcion && (
          <div className="field-error">{errors.descripcion}</div>
        )}

        {/* Número de contrato */}
        <input
          name="contrato"
          type="text"
          className="input-light"
          placeholder="Número de contrato (opcional)"
          value={form.contrato}
          onChange={handleChange}
        />

        <div className="report-actions">
          <button type="submit" className="btn-primary">
            Enviar reporte
          </button>
        </div>

        {errors.general && (
          <p className="field-error">{errors.general}</p>
        )}

        {sent && (
          <p className="success-text">
            ¡Tu reporte ha sido enviado! El equipo técnico lo revisará pronto.
          </p>
        )}
      </form>
    </section>
  );
}
