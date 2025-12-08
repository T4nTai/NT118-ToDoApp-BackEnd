import express from "express";
import cors from "cors";
import { sequelize } from "./config/db.js";
import initModels from "./models/index.js";
import GroupRouter from "./routes/group.route.js";
import InternalRouter from "./routes/internal.route.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());


initModels();


app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "group-service" });
});


app.use("/group", GroupRouter);


app.use("/internal/group", InternalRouter);


app.use(errorHandler);


sequelize
  .authenticate()
  .then(() => console.log("Group DB connected"))
  .catch((err) => console.error("Group DB connect error:", err));

export default app;
