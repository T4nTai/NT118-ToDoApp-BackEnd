import axios from "axios";
import { INTERNAL_API_BASE_URL, INTERNAL_API_KEY } from "./env.js";

const internalApi = axios.create({
  baseURL: INTERNAL_API_BASE_URL || "http://gateway",
  timeout: 5000,
});

internalApi.interceptors.request.use((config) => {
  config.headers["X-Internal-Call"] = "true";
  if (INTERNAL_API_KEY) {
    config.headers["X-Internal-Secret"] = INTERNAL_API_KEY;
  }
  return config;
});

export default internalApi;
