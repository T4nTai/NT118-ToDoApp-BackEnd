import dotenv from "dotenv";
dotenv.config();

export const {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PASS,
  JWT_SECRET,
  INTERNAL_API_BASE_URL,
  INTERNAL_API_KEY,
  NODE_ENV,
} = process.env;