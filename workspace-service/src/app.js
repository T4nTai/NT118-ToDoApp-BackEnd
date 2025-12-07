import express from "express";
import cors from "cors";
import WorkspaceRouter  from "./routes/workspace.route.js";
import Workspace_memberRouter  from "./routes/workspace_member.route.js";
import  { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "Workspace OK" }));

app.use("/workspaces", WorkspaceRouter);
app.use("/members", Workspace_memberRouter);

app.use( errorHandler );

export default app;
