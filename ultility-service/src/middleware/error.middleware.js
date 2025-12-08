export function errorHandler(err, req, res, next) {
  console.error("Unhandled error (utility-service):", err);

  if (res.headersSent) return next(err);

  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
}