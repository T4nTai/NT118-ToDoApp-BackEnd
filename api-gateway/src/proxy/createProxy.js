import { createProxyMiddleware } from "http-proxy-middleware";

export function createServiceProxy(target, rewritePath = null) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: rewritePath || undefined,
    onProxyReq(proxyReq, req) {
      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }
      if (req.user) {
        proxyReq.setHeader("x-user-id", String(req.user.user_id || req.user.id));
      }
    },
    onError(err, req, res) {
      console.error("[Proxy Error]", err.message);
      res.status(502).json({ message: "Service Unavailable", service: target });
    }
  });
}
