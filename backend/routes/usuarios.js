import express from "express";
import db from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/* PERFIL DEL USUARIO LOGUEADO */
router.get("/", authMiddleware([1]), async (req, res) => {
  res.json({
    message: "Ruta protegida OK",
    user: req.user
  });
});

/* LISTAR USUARIOS (SOLO ADMIN) */
router.get("/", authMiddleware([1]), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.email,
        u.telefono,
        r.nombre AS rol
      FROM usuarios u
      JOIN roles r ON r.id = u.rol_id
      ORDER BY u.creado DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
});

/* CREAR USUARIO (ADMIN) */
router.post("/", authMiddleware([1]), async (req, res) => {
  const { nombre, apellido, email, telefono, clave, rol_id } = req.body;

  if (!nombre || !apellido || !email || !clave || !rol_id) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const hash = await bcrypt.hash(clave, 10);

    await db.query(
      `INSERT INTO usuarios
       (nombre, apellido, email, telefono, clave, rol_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, email, telefono, hash, rol_id]
    );

    res.json({ success: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email ya registrado" });
    }
    console.error(err);
    res.status(500).json({ error: "Error creando usuario" });
  }
});

/* ACTUALIZAR USUARIO (ADMIN) */
router.put("/:id", authMiddleware([1]), async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono, rol_id } = req.body;

  try {
    await db.query(
      `UPDATE usuarios
       SET nombre = ?, apellido = ?, telefono = ?, rol_id = ?
       WHERE id = ?`,
      [nombre, apellido, telefono, rol_id, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando usuario" });
  }
});

/* ELIMINAR USUARIO (ADMIN) */
router.delete("/:id", authMiddleware([1]), async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  if (Number(id) === adminId) {
    return res
      .status(400)
      .json({ error: "No puedes eliminar tu propio usuario" });
  }

  try {
    await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando usuario" });
  }
});

export default router;