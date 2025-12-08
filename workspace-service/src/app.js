import express from "express";
import cors from "cors";
import "./config/env.js";
import { sequelize } from "./config/db.js";
import initModels from "./models/index.js";
import Workspace_memberRouter from "./routes/workspace_member.route.js";
import WorkspaceRouter from "./routes/workspace.route.js";
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


initModels();


app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "workspace-service" });
});


app.use("/workspace", WorkspaceRouter);

app.use("/workspace_member", Workspace_memberRouter);

app.use("/internal/workspace", InternalRouter);


app.use(errorHandler);
sequelize
  .authenticate()
  .then(() => console.log("Workspace DB connected"))
  .catch((err) => console.error("Workspace DB connect error:", err));

export default app;
