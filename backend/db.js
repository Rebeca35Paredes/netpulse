import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "netpulse",
  password: process.env.DB_PASSWORD || "netpulse",
  database: process.env.DB_NAME || "pulseapp",
  port: process.env.DB_PORT || 3306
});

db.getConnection()
  .then(conn => {
    console.log("✅ Conectado a MySQL correctamente");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Error conectando a MySQL:", err.message);
  });

export default db;
