export function authenticateFromGateway(req, res, next) {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({ message: "Missing user context from gateway" });
  }

  req.user = {
    id: parseInt(userId, 10),
    email: req.headers["x-user-email"] || null,
    role: req.headers["x-user-role"] || null,
  };

  next();
}
