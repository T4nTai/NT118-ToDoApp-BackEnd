import express from "express";
import cors from "cors";
import { sequelize } from "./config/db.js";
import { PORT } from "./config/env.js";

import External_accountRouter from "./routes/external_account.route.js";
import FileRouter from "./routes/file.route.js";
import InternalRouter from "./routes/internal.route.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://todowebadimin.vercel.app'],      
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());


app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "utility-service", port: PORT });
});

app.use("/external-accounts", External_accountRouter);
app.use("/files", FileRouter);
app.use("/internal/file", InternalRouter);

app.use(errorHandler);

sequelize
  .authenticate()
  .then(() => console.log("utility DB connected"))
  .catch((err) => console.error("utility DB connect error:", err));

export default app;
