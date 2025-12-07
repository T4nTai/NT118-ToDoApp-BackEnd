import { config } from "dotenv";
import path from "path";

config({
  path: path.resolve(process.cwd(), `.env.gateway.local`),  
});

export const PORT = process.env.PORT;
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
export const WORKSPACE_SERVICE_URL = process.env.WORKSPACE_SERVICE_URL;
export const GROUP_SERVICE_URL = process.env.GROUP_SERVICE_URL;
export const PROJECT_SERVICE_URL = process.env.PROJECT_SERVICE_URL;
export const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;