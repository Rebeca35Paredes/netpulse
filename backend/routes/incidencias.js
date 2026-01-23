import express from "express";
import db from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* LISTAR INCIDENCIAS SEGÚN ROL */
router.get("/", authMiddleware, async (req, res) => {
  const { id, rol } = req.user;

  let sql = `
    SELECT 
      i.id,
      i.titulo,
      i.descripcion,
      i.prioridad,
      i.estado,
      DATE(i.fecha) AS fecha,
      u.nombre AS cliente,
      t.nombre AS tecnico
    FROM incidencias i
    LEFT JOIN usuarios u ON u.id = i.id_usuario
    LEFT JOIN usuarios t ON t.id = i.id_tecnico
  `;

  const params = [];

  if (rol === "tecnico") {
    sql += " WHERE i.id_tecnico = ?";
    params.push(userId);
  }

  if (rol === "usuario") {
    sql += " WHERE i.id_usuario = ?";
    params.push(userId);
  }

  sql += " ORDER BY i.fecha DESC";

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo incidencias" });
  }
});

/* CREAR UNA INCIDENCIA */
router.post("/crear", async (req, res) => {
  const {
    titulo,
    descripcion,
    tipo,
    prioridad,
    contrato,
    estadoInternet,
    lucesOnt,
    revisionCable,
    id_usuario
  } = req.body;

  try {
    await db.query(
      `INSERT INTO incidencias 
        (titulo, descripcion, tipo, prioridad, contrato,
         estadoInternet, lucesOnt, revisionCable, id_usuario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        descripcion,
        tipo,
        prioridad,
        contrato,
        estadoInternet,
        lucesOnt,
        revisionCable,
        id_usuario
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la incidencia." });
  }
});

/* STATS PARA EL DASHBOARD */
router.get("/stats", async (req, res) => {
  try {
    const [[abiertas]] = await db.query(
      "SELECT COUNT(*) AS total FROM incidencias WHERE estado != 'Cerrada'"
    );

    const [[sinAsignar]] = await db.query(
      "SELECT COUNT(*) AS total FROM incidencias WHERE tecnico_id IS NULL"
    );

    const [[usuariosActivos]] = await db.query(
      "SELECT COUNT(*) AS total FROM usuarios"
    );

    res.json({
      abiertas: abiertas.total,
      sinAsignar: sinAsignar.total,
      usuariosActivos: usuariosActivos.total
    });
  } catch (error) {
    console.error("❌ Error en stats:", error.message);
    res.status(500).json({ error: "Error obteniendo estadísticas" });
  }
});

/* INCIDENCIAS RECIENTES */
router.get("/recientes", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        titulo,
        prioridad,
        estado,
        DATE(fecha_reporte) AS fecha
      FROM incidencias
      ORDER BY fecha_reporte DESC
      LIMIT 10
    `);

    res.json(rows);
  } catch (error) {
    console.error("❌ Error en recientes:", error.message);
    res.status(500).json({ error: "Error obteniendo incidencias recientes" });
  }
});

export default router;
