import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  // No está logueado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rol no permitido
  if (allowedRoles && !allowedRoles.includes(user.rol_id)) {
    return <Navigate to="/" replace />;
  }

  // Todo OK
  return children;
}
