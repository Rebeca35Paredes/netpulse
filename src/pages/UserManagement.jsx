import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    rol_id: 3, // usuario por defecto
  });

  // cargar usuarios
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await apiFetch("/api/usuarios");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  // crear usuario
  async function handleCreateUser() {
    setError("");

    if (!form.nombre || !form.email) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      await apiFetch("/api/usuarios/crear", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setShowModal(false);
      setForm({ nombre: "", email: "", rol_id: 3 });
      loadUsers();
    } catch (err) {
      setError("Error creando usuario");
    }
  }

  return (
    <section className="page">
      {/* HEADER */}
      <div className="page-header page-header-left">
        <h1>Gestión de usuarios</h1>
        <p>Administra administradores, técnicos y usuarios</p>
      </div>

      <button
        className="btn-primary"
        onClick={() => setShowModal(true)}
      >
        + Crear usuario
      </button>

      {/* TABLA */}
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
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  {u.rol_id === 1 && "Admin"}
                  {u.rol_id === 2 && "Técnico"}
                  {u.rol_id === 3 && "Usuario"}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="3">No hay usuarios</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Crear usuario</h2>

            <label>Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
            />

            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <label>Rol</label>
            <select
              value={form.rol_id}
              onChange={(e) =>
                setForm({ ...form, rol_id: Number(e.target.value) })
              }
            >
              <option value={1}>Admin</option>
              <option value={2}>Técnico</option>
              <option value={3}>Usuario</option>
            </select>

            {error && <p className="field-error">{error}</p>}

            <button
              className="btn-primary"
              onClick={handleCreateUser}
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}