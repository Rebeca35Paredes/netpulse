// src/App.jsx
import { createContext, useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recover from "./pages/Recover";

import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import MyIncidents from "./pages/MyIncidents";
import UserManagement from "./pages/UserManagement";
import TechnicianBoard from "./pages/TechnicianBoard";
import AdminBoard from "./pages/AdminBoard";

// contexto sencillo de autenticación
export const AuthContext = createContext(null);

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  // No logueado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rol no permitido
  if (allowedRoles && !allowedRoles.includes(user.rol_id)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});

const login = (userData) => {
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};

const logout = () => {
  setUser(null);
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

  const authValue = { user, login, logout };

  return (
    <AuthContext.Provider value={authValue}>
      <div className="app">
        <Navbar />
        <main className="main">
          <Routes>
            {/* PÚBLICAS */}
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/servicios" element={<Services />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/recuperar" element={<Recover />} />

            {/* PRIVADAS (incidencias) */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={[1, 2]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/reportar-incidencia"
              element={
                <PrivateRoute allowedRoles={[3]}>
                  <ReportIssue />
                </PrivateRoute>
              }
            />
            <Route
              path="/mis-incidencias"
              element={
                <PrivateRoute allowedRoles={[3]}>
                  <MyIncidents />
                </PrivateRoute>
              }
            />
            <Route
              path="/gestion-usuarios"
              element={
                <PrivateRoute allowedRoles={[1]}>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/panel-tecnico"
              element={
                <PrivateRoute allowedRoles={[2]}>
                  <TechnicianBoard />
                </PrivateRoute>
              }
            />
            <Route
              path="/panel-admin"
              element={
                <PrivateRoute allowedRoles={[1]}>
                  <AdminBoard />
                </PrivateRoute>
              }
            />

            <Route
              path="/users"
              element={
                <PrivateRoute allowedRoles={[1]}>
                  <UserManagement />
                </PrivateRoute>
              }
            />

            {/* por si se va a una ruta rara */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthContext.Provider>
  );
}
