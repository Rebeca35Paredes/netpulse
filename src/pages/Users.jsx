import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newUser, setNewUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    clave: "",
    rol_id: 2 // técnico por defecto
  });

  const [error, setError] = useState("");

  /* =========================
     CARGAR USUARIOS
  ========================== */
  const loadUsers = async () => {
    try {
      const data = await apiFetch("http://localhost:4000/api/usuarios");
      setUsers(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* =========================
     CREAR USUARIO
  ========================== */
  const handleAddUser = async () => {
    setError("");

    if (!newUser.nombre || !newUser.apellido || !newUser.email || !newUser.clave) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      await apiFetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        body: JSON.stringify(newUser)
      });

      setShowModal(false);
      setNewUser({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        clave: "",
        rol_id: 2
      });

      loadUsers();
    } catch (err) {
      setError(err.error || "Error creando usuario");
    }
  };

  /* =========================
     RENDER
  ========================== */
  return (
    <section className="page">
      <div className="page-header page-header-left">
        <h1>Usuarios del sistema</h1>
        <p>Administra administradores, técnicos y usuarios.</p>
      </div>

      <div className="table-actions">
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Agregar usuario
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre} {u.apellido}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="3">No hay usuarios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Agregar usuario</h2>

            <label>Nombre</label>
            <input
              type="text"
              value={newUser.nombre}
              onChange={(e) =>
                setNewUser({ ...newUser, nombre: e.target.value })
              }
            />

            <label>Apellido</label>
            <input
              type="text"
              value={newUser.apellido}
              onChange={(e) =>
                setNewUser({ ...newUser, apellido: e.target.value })
              }
            />

            <label>Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <label>Teléfono</label>
            <input
              type="text"
              value={newUser.telefono}
              onChange={(e) =>
                setNewUser({ ...newUser, telefono: e.target.value })
              }
            />

            <label>Clave</label>
            <input
              type="password"
              value={newUser.clave}
              onChange={(e) =>
                setNewUser({ ...newUser, clave: e.target.value })
              }
            />

            <label>Rol</label>
            <select
              value={newUser.rol_id}
              onChange={(e) =>
                setNewUser({ ...newUser, rol_id: Number(e.target.value) })
              }
            >
              <option value={1}>Admin</option>
              <option value={2}>Técnico</option>
              <option value={3}>Usuario</option>
            </select>

            {error && <p className="field-error">{error}</p>}

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleAddUser}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
