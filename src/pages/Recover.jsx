import { useState } from "react";
import { recoverAccount } from "../services/auth";

export default function Recover() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await recoverAccount(email);
      setSuccess(true);
    } catch (err) {
      setError("No se pudo enviar el enlace de recuperación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page auth-page">
      <h2>RECUPERAR CUENTA</h2>
      <p>Envía tu correo electrónico para mandar enlace de recuperación.</p>

      <form className="card auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">Revisa tu correo 📩</p>}

        <button
          type="submit"
          className="btn-primary full-width"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </section>
  );
}
