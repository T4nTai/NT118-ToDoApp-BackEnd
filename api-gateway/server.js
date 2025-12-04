import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { 
  PORT, 
  CORS_ORIGIN, 
  AUTH_SERVICE_URL, 
  WORKSPACE_SERVICE_URL, 
  GROUP_SERVICE_URL, 
  PROJECT_SERVICE_URL, 
  TASK_SERVICE_URL 
} from './src/config/env.js';
import { authMiddleware } from './src/middleware/auth.middleware.js';

dotenv.config();

const app = express();
app.use(morgan("dev")); 
app.use(cors({
  origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

function createServiceProxy(target, rewritePath = null) {
  const proxyOptions = {
    target: target,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Proxy] ${req.method} ${req.path} -> ${target}${proxyReq.path}`);
      if (req.headers["authorization"]) {
        proxyReq.setHeader("Authorization", req.headers["authorization"]);
      }
    },
    onError: (err, req, res) => {
      console.error(`[Proxy Error] ${target}:`, err.message);
      if (!res.headersSent) {
        res.status(502).json({ message: "Service Unavailable", service: target });
      }
    }
  };
  if (rewritePath) {
    proxyOptions.pathRewrite = rewritePath;
  }

  return createProxyMiddleware(proxyOptions);
}

console.log("--- Gateway Configuration ---");
console.log("Auth Service:", AUTH_SERVICE_URL || "NOT SET");

app.get("/health", (req, res) => {
  res.json({ status: "Gateway Online", time: new Date().toISOString() });
});

if (AUTH_SERVICE_URL) {
  app.use("/auth", createServiceProxy(AUTH_SERVICE_URL)); 
}
if (WORKSPACE_SERVICE_URL){
  app.use("/workspace", authMiddleware, createServiceProxy(WORKSPACE_SERVICE_URL));
}
if (GROUP_SERVICE_URL){
  app.use("/group", authMiddleware, createServiceProxy(GROUP_SERVICE_URL));
}
if (PROJECT_SERVICE_URL){
  app.use("/project", authMiddleware, createServiceProxy(PROJECT_SERVICE_URL));
}
if (TASK_SERVICE_URL){
  app.use("/task", authMiddleware, createServiceProxy(TASK_SERVICE_URL));
}
app.use((req, res) => {
  res.status(404).json({ message: "Gateway: Endpoint not found" });
});

const SERVER_PORT = PORT || 3001;
app.listen(SERVER_PORT, () => {
  console.log(`🚀 API Gateway running on port ${SERVER_PORT}`);
});