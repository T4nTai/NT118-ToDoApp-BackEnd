import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import workspaceRoutes from "./routes/workspace.route.js";
import groupRoutes from "./routes/group.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";

const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "API Gateway Online" });
});


app.use(authRoutes);
app.use(workspaceRoutes);
app.use(groupRoutes);
app.use(projectRoutes);
app.use(taskRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Gateway: endpoint not found" });
});

export default app;