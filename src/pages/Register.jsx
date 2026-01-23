// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";

    if (!form.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio.";
    } else if (!/^[0-9+\s-]{7,15}$/.test(form.telefono.trim())) {
      newErrors.telefono = "Ingresa un teléfono válido.";
    }

    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Ingresa un email válido.";
    }

    if (!form.password.trim()) {
      newErrors.password = "La clave es obligatoria.";
    } else if (form.password.length < 6) {
      newErrors.password = "La clave debe tener al menos 6 caracteres.";
    }

    if (!form.confirm.trim()) {
      newErrors.confirm = "Debes confirmar la clave.";
    } else if (form.confirm !== form.password) {
      newErrors.confirm = "Las claves no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        email: form.email,
        clave: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al registrar usuario");
      return;
    }

    alert("Usuario registrado correctamente. Ahora inicia sesión.");
    navigate("/login");
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor");
  }
};

  return (
    <section className="page auth-page">
      <div className="login-header-logo">
        <div className="logo-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="none"
            stroke="#5b8dff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>

        <span className="logo-text">pulse</span>
      </div>

      <h2>REGÍSTRATE</h2>

      <form className="card auth-form grid-2" onSubmit={handleSubmit} noValidate>
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
          {errors.nombre && <div className="field-error">{errors.nombre}</div>}
        </label>

        <label>
          Apellido
          <input
            name="apellido"
            type="text"
            placeholder="Ingresa tu apellido"
            value={form.apellido}
            onChange={handleChange}
            className={errors.apellido ? "input-error" : ""}
          />
          {errors.apellido && (
            <div className="field-error">{errors.apellido}</div>
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
          Email
          <input
            name="email"
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </label>

        <label>
          Clave
          <input
            name="password"
            type="password"
            placeholder="Ingresa tu clave"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && (
            <div className="field-error">{errors.password}</div>
          )}
        </label>

        <label>
          Confirmar clave
          <input
            name="confirm"
            type="password"
            placeholder="Confirma tu clave"
            value={form.confirm}
            onChange={handleChange}
            className={errors.confirm ? "input-error" : ""}
          />
          {errors.confirm && (
            <div className="field-error">{errors.confirm}</div>
          )}
        </label>

        <button type="submit" className="btn-primary full-width">
          Registrarme
        </button>
        {errors.general && (
          <p className="field-error" style={{ gridColumn: "1 / -1" }}>
            {errors.general}
          </p>
        )}
      </form>

      <p className="auth-footer">
        ¿Tienes una cuenta? <Link to="/login">Accede</Link>
      </p>
    </section>
  );
}
