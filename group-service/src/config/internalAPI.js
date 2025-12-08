import axios from "axios";
import { INTERNAL_API_BASE_URL, INTERNAL_API_KEY } from "./env.js";

const internalApi = axios.create({
  baseURL: INTERNAL_API_BASE_URL || "http://localhost:3001",
  timeout: 10000,
});

internalApi.interceptors.request.use((config) => {
  config.headers["X-Internal-Call"] = "true";

  if (INTERNAL_API_KEY) {
    config.headers["X-Internal-Secret"] = INTERNAL_API_KEY;
  }

  console.log(
    "[internalApi] =>",
    (config.method || "GET").toUpperCase(),
    config.baseURL + config.url
  );

  return config;
});

internalApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      console.error(
        "[internalApi] error",
        err.response.status,
        err.response.data
      );
    } else {
      console.error("[internalApi] error", err.message);
    }
    return Promise.reject(err);
  }
);

export default internalApi;
