import { useState, useContext } from "react";
import { AuthContext } from "../App";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // VALIDACIONES
  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un email válido.";
    }

    if (!clave.trim()) {
      newErrors.clave = "La clave es obligatoria.";
    } else if (clave.length < 6) {
      newErrors.clave = "La clave debe tener al menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, clave })
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors((prev) => ({ ...prev, general: data.error }));
      return;
    }

    // Guardar token
    localStorage.setItem("token", data.token);

    // Guardar usuario en contexto
    login(data.user);

    // 🔑 REDIRECCIÓN POR ROL (CLAVE)
    if (data.user.rol_id === 1) {
      navigate("/dashboard");
    } else if (data.user.rol_id === 2) {
      navigate("/panel-tecnico");
    } else {
      navigate("/mis-incidencias");
    }

  } catch (err) {
    console.error("Error de conexión:", err);
    setErrors({ general: "No se pudo conectar con el servidor." });
  }
};

  return (
    <section className="page auth-page login">
      <div className="login-header-logo">
        <div className="logo-circle">🌐</div>
        <span className="logo-text">pulse</span>
      </div>

      <h2>INICIAR SESIÓN</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <div className="input-wrapper">
            <span className="input-icon-left">✉️</span>

            <input
              type="text"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input-field ${errors.email ? "input-error" : ""}`}
            />
          </div>
          {errors.email && <p className="field-error">{errors.email}</p>}
        </label>

        <label>
          Clave
          <div className="input-wrapper">
            <span className="input-icon-left">🔒</span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className={`input-field ${errors.clave ? "input-error" : ""}`}
            />

            <span
              className="input-icon-right"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {errors.clave && <p className="field-error">{errors.clave}</p>}
        </label>

        <button className="btn-primary full-width">Acceder</button>
      </form>

      {errors.general && <p className="field-error">{errors.general}</p>}

      <p className="auth-footer">
        <Link to="/recuperar">Olvidé mi contraseña</Link>
      </p>
      <p className="auth-footer">
        ¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </section>
  );
}
