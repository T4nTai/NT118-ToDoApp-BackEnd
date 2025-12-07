export function errorHandler(err, req, res, next) {
  console.error("🔥 Error Middleware:", {
    message: err.message,
    status: err.status,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
  if (err.status) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message || "Something went wrong"
    });
  }

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      status: 400,
      message: err.errors?.[0]?.message || "Validation error"
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      status: 400,
      message: err.errors?.[0]?.message || "Duplicate entry"
    });
  }
  if (err.isAxiosError) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Internal service error";

    return res.status(status).json({
      status,
      message: `Internal API Error: ${message}`
    });
  }
}
