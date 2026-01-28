import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import usuariosRoutes from "./routes/usuarios.js";
import incidenciasRoutes from "./routes/incidencias.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/incidencias", incidenciasRoutes);

app.get("/", (req, res) => {
  res.send("API NetPulse funcionando");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});
