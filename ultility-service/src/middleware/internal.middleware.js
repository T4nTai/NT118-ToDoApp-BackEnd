import { INTERNAL_API_KEY } from "../config/env.js";

export function internalMiddleware(req, res, next) {
  const internalHeader = req.headers["x-internal-call"];
  const internalSecret = req.headers["x-internal-secret"];

  if (internalHeader !== "true") {
    return res.status(403).json({ message: "Forbidden: internal only" });
  }

  if (INTERNAL_API_KEY && internalSecret !== INTERNAL_API_KEY) {
    return res.status(403).json({ message: "Forbidden: invalid internal key" });
  }

  next();
}