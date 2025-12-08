import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const GatewayRouter = Router();

GatewayRouter.get("/verify", (req, res) => {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).end(); 
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).end();
    res.setHeader("X-User-Id", decoded.id);
    res.setHeader("X-User-Email", decoded.email || "");
    res.setHeader("X-User-Role", decoded.role || "");
    return res.status(200).end();
  });
});

export default GatewayRouter;
