export function errorHandler(err, req, res, next) {
  console.error("Gateway error:", err);
  res.status(500).json({ message: "Gateway error", error: err.message });
}
