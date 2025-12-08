export function errorHandler(err, req, res, next) {
  console.error(" Project Service Error:", err);

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
}
