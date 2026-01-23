import jwt from "jsonwebtoken";

export default function authMiddleware(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.rol_id)) {
        return res.status(403).json({ error: "Acceso denegado" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
}
