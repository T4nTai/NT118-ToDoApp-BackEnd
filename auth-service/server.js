import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.route.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();
const app = express();
app.use(express.json()); // Để đọc req.body từ JSON
app.use(express.urlencoded({ extended: true })); // Để đọc form data
app.use(cookieParser()); // Để đọc req.cookies (nếu token lưu trong cookie)
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ status: "auth-service ok" }));

app.use("/", authRoutes);

app.use((err, req, res, next) => {
  console.error("Auth Service Error:", err);
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Auth Service running on port ${PORT}`);
});
