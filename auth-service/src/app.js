import express from "express";
import cors from "cors";
import "./config/env.js";
import { sequelize } from "./config/db.js";
import initModels from "./models/index.js";
import authRoutes from "./routes/auth.route.js";
import internalRoutes from "./routes/internal.route.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

initModels();


app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "auth-service" });
});


app.use("/auth", authRoutes);


app.use("/internal/auth", internalRoutes);


app.use(errorHandler);


sequelize
  .authenticate()
  .then(() => console.log("Auth DB connected"))
  .catch((err) => console.error("Auth DB connect error:", err));

export default app;
