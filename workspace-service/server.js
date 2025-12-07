import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import WorkspaceRouter from "./src/routes/workspace.route.js";
import { connectDB } from "./src/config/db.js";
import initAssociations from "./src/models/association.model.js";

dotenv.config();
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ status: "workspace-service ok" }));

app.use("/", WorkspaceRouter);

app.use((err, req, res, next) => {
  console.error("Workspace Service Error:", err);
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  await connectDB();
  initAssociations();
  console.log(`Workspace Service running on port ${PORT}`);
});
