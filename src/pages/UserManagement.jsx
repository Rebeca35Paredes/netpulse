import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    clave: "",
    rol_id: 3, // usuario por defecto
  });

  /* =========================
     CARGAR USUARIOS
  ========================== */
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await apiFetch("/usuarios");
      setUsers(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  }

  /* =========================
     CREAR / EDITAR
  ========================== */
  function openCreate() {
    setEditingUser(null);
    setForm({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      clave: "",
      rol_id: 3,
    });
    setError("");
    setShowModal(true);
  }

  function openEdit(user) {
    setEditingUser(user);
    setForm({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono || "",
      clave: "",
      rol_id: user.rol_id,
    });
    setError("");
    setShowModal(true);
  }

  async function handleSaveUser() {
    setError("");
    setLoadingAction(true);

    try {
      if (!form.nombre || !form.apellido || !form.email) {
        setError("Nombre, apellido y email son obligatorios");
        return;
      }

      if (!editingUser && !form.clave) {
        setError("La clave es obligatoria para crear usuario");
        return;
      }

      if (editingUser) {
        // EDITAR
        await apiFetch(`/usuarios/${editingUser.id}`, {
          method: "PUT",
          body: JSON.stringify({
            nombre: form.nombre,
            apellido: form.apellido,
            telefono: form.telefono,
            rol_id: form.rol_id,
          }),
        });
      } else {
        // CREAR
        await apiFetch("/usuarios", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setShowModal(false);
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      setError(err.error || "Error guardando usuario");
    } finally {
      setLoadingAction(false);
    }
  }

  /* =========================
     ELIMINAR
  ========================== */
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer."
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(`/usuarios/${id}`, {
        method: "DELETE",
      });
      loadUsers();
    } catch (err) {
      alert(err.error || "Error eliminando usuario");
    }
  }

  /* =========================
     RENDER
  ========================== */
  return (
    <section className="page">
      {/* HEADER */}
      <div className="page-header page-header-left">
        <h1>Gestión de usuarios</h1>
        <p>Administra administradores, técnicos y usuarios</p>
      </div>

      {/* ACTIONS */}
      <div className="table-actions">
        <button className="btn-primary" onClick={openCreate}>
          + Crear usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre} {u.apellido}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>

                <td style={{ textAlign: "center" }}>
                  <button
                    className="icon-btn edit"
                    title="Editar"
                    onClick={() => openEdit(u)}
                  >
                    ✏️
                  </button>

                  <button
                    className="icon-btn delete"
                    title="Eliminar"
                    onClick={() => handleDelete(u.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editingUser ? "Editar usuario" : "Crear usuario"}</h2>

            <label>Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
            />

            <label>Apellido</label>
            <input
              value={form.apellido}
              onChange={(e) =>
                setForm({ ...form, apellido: e.target.value })
              }
            />

            <label>Email</label>
            <input
              type="email"
              value={form.email}
              disabled={!!editingUser}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <label>Teléfono</label>
            <input
              value={form.telefono}
              onChange={(e) =>
                setForm({ ...form, telefono: e.target.value })
              }
            />

            {!editingUser && (
              <>
                <label>Clave</label>
                <input
                  type="password"
                  value={form.clave}
                  onChange={(e) =>
                    setForm({ ...form, clave: e.target.value })
                  }
                />
              </>
            )}

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

            <div className="modal-actions">
              <button className="btn-primary" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                disabled={loadingAction}
                onClick={handleSaveUser}
              >
                {loadingAction ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
