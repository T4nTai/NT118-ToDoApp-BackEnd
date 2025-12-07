import { INTERNAL_SERVICE_KEY } from "../config/env.js";

export function internalMiddleware(req, res, next) {
  const key = req.headers["x-internal-key"];

  if (!key || key !== INTERNAL_SERVICE_KEY) {
    return res.status(403).json({ message: "Invalid internal access" });
  }

  next();
}
