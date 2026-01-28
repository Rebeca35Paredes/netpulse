import express from "express";
import db from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("incidencias.js CARGADO");

router.get("/ping", (req, res) => {
  console.log("/ping ejecutado");
  res.json({ ok: true });
});

/* LISTAR INCIDENCIAS SEGÚN ROL */
router.get("/", authMiddleware([1]), async (req, res) => {
  try {
    const sql = `
      SELECT
        i.id,
        i.titulo,
        i.estado,
        DATE(i.fecha_reporte) AS fecha,
        u.nombre AS cliente,
        t.nombre AS tecnico
      FROM incidencias i
      LEFT JOIN usuarios u ON u.id = i.usuario_id
      LEFT JOIN usuarios t ON t.id = i.tecnico_id
      ORDER BY i.id DESC
    `;

    const [rows] = await db.query(sql);

    // ✅ RESPUESTA OBLIGATORIA
    return res.json(rows);

  } catch (err) {
    console.error("Error obteniendo incidencias:", err);
    return res.status(500).json({ error: "Error del servidor" });
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
    console.error("Error en stats:", error.message);
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
    console.error("Error en recientes:", error.message);
    res.status(500).json({ error: "Error obteniendo incidencias recientes" });
  }
});

/* ASIGNAR TÉCNICO A INCIDENCIA (ADMIN) */
router.put("/:id/asignar", authMiddleware([1]), async (req, res) => {
  const { id } = req.params; // id de incidencia
  const { tecnico_id } = req.body;

  if (!tecnico_id) {
    return res.status(400).json({ error: "tecnico_id requerido" });
  }

  try {
    // Validar que el técnico exista y sea técnico
    const [tecnicos] = await db.query(
      "SELECT id FROM usuarios WHERE id = ? AND rol_id = 2",
      [tecnico_id]
    );

    if (tecnicos.length === 0) {
      return res.status(400).json({ error: "El técnico no existe o no es válido" });
    }

    // Asignar técnico a la incidencia
    const [result] = await db.query(
      `UPDATE incidencias
       SET tecnico_id = ?, estado = 'Asignada'
       WHERE id = ?`,
      [tecnico_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Incidencia no encontrada" });
    }

    res.json({
      success: true,
      message: "Técnico asignado correctamente"
    });
  } catch (err) {
    console.error("Error asignando técnico:", err);
    res.status(500).json({ error: "Error asignando técnico" });
  }
});

router.get("/sin-asignar", authMiddleware([1]), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, titulo, prioridad, estado
      FROM incidencias
      WHERE tecnico_id IS NULL
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo incidencias" });
  }
});

/* ACTUALIZAR ESTADO (TÉCNICO) */
router.put("/:id/estado", authMiddleware([2]), async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const tecnicoId = req.user.id;

  const estadosValidos = ["Asignada", "En progreso", "Resuelta"];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: "Estado no válido" });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE incidencias
      SET estado = ?
      WHERE id = ? AND tecnico_id = ?
      `,
      [estado, id, tecnicoId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "No autorizado" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando estado" });
  }
});


/* INCIDENCIAS DEL TÉCNICO LOGUEADO */
router.get("/mis-asignadas", authMiddleware([2]), async (req, res) => {
  const tecnicoId = req.user.id;

  try {
    const [rows] = await db.query(
      `
      SELECT
        i.id,
        i.titulo,
        i.prioridad,
        i.estado,
        DATE(i.fecha_reporte) AS fecha,
        u.nombre AS cliente
      FROM incidencias i
      JOIN usuarios u ON u.id = i.usuario_id
      WHERE i.tecnico_id = ?
      ORDER BY i.fecha_reporte DESC
      `,
      [tecnicoId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error obteniendo incidencias del técnico:", err);
    res.status(500).json({ error: "Error obteniendo incidencias" });
  }
});

// INCIDENCIAS ASIGNADAS AL TÉCNICO
router.get("/tecnico", authMiddleware([2]), async (req, res) => {
  const tecnicoId = req.user.id;

  try {
    const [rows] = await db.query(`
      SELECT
        i.id,
        i.titulo,
        i.prioridad,
        i.estado,
        DATE(i.fecha_reporte) AS fecha,
        u.nombre AS cliente
      FROM incidencias i
      JOIN usuarios u ON u.id = i.usuario_id
      WHERE i.tecnico_id = ?
      ORDER BY i.id DESC
    `, [tecnicoId]);

    res.json(rows);
  } catch (err) {
    console.error("Error incidencias técnico:", err);
    res.status(500).json({ error: "Error obteniendo incidencias" });
  }
});


export default router;
