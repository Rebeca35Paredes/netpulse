// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../App";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const menuRef = useRef(null);

  const LoginIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
      fill="none" viewBox="0 0 24 24" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );

  const LogoutIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
      fill="none" viewBox="0 0 24 24" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  const isLoggedIn = !!user;
  const rol =
    user?.rol_id === 1 ? "admin" :
    user?.rol_id === 2 ? "tecnico" :
    "usuario";


  const handleLogoClick = () => {
    if (!isLoggedIn) return navigate("/");
    if (rol === "usuario") return navigate("/mis-incidencias");
    return navigate("/dashboard");
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  // cerrar dropdown al hacer click afuera
  useEffect(() => {
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    }
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  const displayName = user?.name || user?.email || "Usuario";

  return (
    <header className="navbar">
  {/* LOGO */}
  <div className="navbar-left" onClick={handleLogoClick}>
    <div className="logo-icon">🌐</div>
    <span className="logo-text">pulse</span>
  </div>

  {/* BOTÓN HAMBURGUESA (MOBILE) */}
  <button
    className="navbar-toggle"
    onClick={() => setOpenMobileMenu((s) => !s)}
  >
    {openMobileMenu ? "✕" : "☰"}
  </button>

  {/* LINKS */}
  <nav className={`navbar-links ${openMobileMenu ? "open" : ""}`}>
    {!isLoggedIn ? (
      <>
        <NavLink to="/" end onClick={() => setOpenMobileMenu(false)}>Home</NavLink>
        <NavLink to="/nosotros" onClick={() => setOpenMobileMenu(false)}>Nosotros</NavLink>
        <NavLink to="/servicios" onClick={() => setOpenMobileMenu(false)}>Servicios</NavLink>
        <NavLink to="/contacto" onClick={() => setOpenMobileMenu(false)}>Contacto</NavLink>
      </>
    ) : (
      <>
        {rol === "usuario" && (
          <NavLink to="/mis-incidencias" onClick={() => setOpenMobileMenu(false)}>
            Home
          </NavLink>
        )}

        {rol === "tecnico" && (
          <>
            <NavLink to="/dashboard" end onClick={() => setOpenMobileMenu(false)}>
              Home
            </NavLink>
            <NavLink to="/panel-tecnico" onClick={() => setOpenMobileMenu(false)}>
              Panel técnico
            </NavLink>
          </>
        )}

        {rol === "admin" && (
          <>
            <NavLink to="/dashboard" end onClick={() => setOpenMobileMenu(false)}>
              Home
            </NavLink>
            <NavLink to="/panel-admin" onClick={() => setOpenMobileMenu(false)}>
              Panel
            </NavLink>
            <NavLink to="/users" onClick={() => setOpenMobileMenu(false)}>
              Usuarios
            </NavLink>
          </>
        )}
      </>
    )}
  </nav>

  {/* DERECHA */}
  <div className="navbar-right">
    {isLoggedIn && (
      <div ref={menuRef} className="user-menu-container">
        <button
          className="user-icon-btn"
          onClick={() => setOpenUserMenu((s) => !s)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>

        {openUserMenu && (
          <div className="user-dropdown">
            <strong>{displayName}</strong>
          </div>
        )}
      </div>
    )}

    <button className="navbar-login" onClick={handleLoginClick}>
      {isLoggedIn ? LogoutIcon : LoginIcon}
    </button>
  </div>
</header>
  );
}
