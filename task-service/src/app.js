import express from "express";
import cors from "cors";
import "./config/env.js";
import { sequelize } from "./config/db.js";
import initModels from "./models/index.js";
import TaskRouter from "./routes/task.route.js";
import SubtaskRouter from "./routes/subtask.route.js";
import CommentRouter from "./routes/comment.route.js";
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
  res.json({ status: "ok", service: "task-service" });
});

app.use("/task", TaskRouter);

app.use("/subtask", SubtaskRouter);

app.use("/comment", CommentRouter);

app.use("/internal/task", InternalRouter);


app.use(errorHandler);


sequelize
  .authenticate()
  .then(() => console.log("task DB connected"))
  .catch((err) => console.error("task DB connect error:", err));

export default app;
