import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTRO 
router.post("/register", async (req, res) => {
  const { nombre, apellido, telefono, email, clave } = req.body;

  if (!nombre || !apellido || !email || !clave) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const hash = await bcrypt.hash(clave, 10);
    const rolId = 1; // usuario

    await db.query(
      `INSERT INTO usuarios 
       (nombre, apellido, telefono, email, clave, rol_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, telefono || null, email, hash, 3]
    );

    res.json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("ERROR REGISTER:", err);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, clave } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(clave, user.clave);

    if (!ok) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol_id: user.rol_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol_id: user.rol_id
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// RECUPERAR CUENTA
router.post("/recover", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email requerido" });
  }

  try {
    const [users] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

return res.json({
  message: "Si el correo existe, se enviará un enlace de recuperación",
});


    // token simple (demo)
    const token = crypto.randomBytes(20).toString("hex");

    // opcional: guardar token en DB
    await db.query(
      "UPDATE usuarios SET reset_token = ?, reset_expira = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?",
      [token, email]
    );

    console.log("🔐 Token de recuperación (demo):", token);

    res.json({
      success: true,
      message: "Se ha enviado un enlace de recuperación (simulado)"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al recuperar cuenta" });
  }
});


export default router;