// src/pages/Recover.jsx
export default function Recover() {
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

      <h2>RECUPERAR CUENTA</h2>
      <p>Envía tu correo electrónico para mandar enlace de recuperación.</p>

      <form className="card auth-form">
        <label>
          Email
          <input type="email" placeholder="Ingresa tu correo electrónico" />
        </label>

        <button type="submit" className="btn-primary full-width">
          Enviar
        </button>
      </form>
    </section>
  );
}
