import express from "express";
import cors from "cors";
import "./config/env.js";
import { sequelize } from "./config/db.js";
import initModels from "./models/index.js";
import ProjectRouter from "./routes/project.route.js";
import MilestoneRouter from "./routes/milestone.route.js";
import WorkflowRouter from "./routes/workflow.route.js";
import PerformanceRouter from "./routes/performance.route.js";
import InternalRouter from "./routes/internal.route.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

initModels();

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "project-service" });
});

app.use("/project", ProjectRouter);

app.use("/milestone", MilestoneRouter);

app.use("/workflow", WorkflowRouter);

app.use("/performance", PerformanceRouter);

app.use("/internal/project", InternalRouter);

app.use(errorHandler);


sequelize
  .authenticate()
  .then(() => console.log("project DB connected"))
  .catch((err) => console.error("project DB connect error:", err));

export default app;
