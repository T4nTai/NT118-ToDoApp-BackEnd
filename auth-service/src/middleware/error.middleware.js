export function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  if (err.status) {
    return res.status(err.status).json({
      message: err.message || "Error",
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
}
