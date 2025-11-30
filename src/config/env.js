import { config } from "dotenv";
import path from "path";

config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "Development"}.local`),
});
console.log("✅ Loaded ENV from:", `.env.${process.env.NODE_ENV || "Development"}.local`);
console.log("DB_NAME =", process.env.DB_NAME);
export const PORT = process.env.PORT;
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const DB_PORT = process.env.DB_PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const NODEMAILER_USER = process.env.NODEMAILER_USER;
export const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const MOBILE_SCHEME = process.env.MOBILE_SCHEME;
export const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI_DEV;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;