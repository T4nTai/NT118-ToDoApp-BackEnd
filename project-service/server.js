import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { PORT } from "./src/config/env.js";
import ProjectRouter from "./src/routes/project.route.js";
import MilestoneRouter from "./src/routes/milestone.route.js";
import WorkflowRouter from "./src/routes/workflow.route.js";
import PerformanceRouter from "./src/routes/performance.route.js";

import { connectDB } from "./src/config/db.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));


app.get("/health", (req, res) => {
  res.json({ status: "project-service ok" });
});


app.use("/", ProjectRouter);
app.use("/", MilestoneRouter);
app.use("/", WorkflowRouter);
app.use("/", PerformanceRouter);


app.use((err, req, res, next) => {
  console.error("Project Service Error:", err);
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Project Service running on port ${PORT}`);
});
