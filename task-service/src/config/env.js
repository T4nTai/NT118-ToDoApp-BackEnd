import { config } from "dotenv";
import path from "path";

config({
  path: path.resolve(process.cwd(), `.env.auth.local`),  
});

export const PORT = process.env.PORT;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_NAME = process.env.DB_NAME;
export const JWT_SECRET = process.env.JWT_SECRET;