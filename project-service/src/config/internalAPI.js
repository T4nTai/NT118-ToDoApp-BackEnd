import axios from "axios";
import {
  INTERNAL_API_KEY,
  AUTH_SERVICE_URL,
  WORKSPACE_SERVICE_URL,
  GROUP_SERVICE_URL,
  UTILITY_SERVICE_URL
} from "./env.js";

function createInternalClient(baseURL) {
  const client = axios.create({
    baseURL,
    timeout: 10000,
  });
  console.log(INTERNAL_API_KEY)

  client.interceptors.request.use((config) => {
    config.headers["X-Internal-Call"] = "true";
    if (INTERNAL_API_KEY) {
      config.headers["X-Internal-Secret"] = INTERNAL_API_KEY;
    }


    console.log(
      "[internal]",
      (config.method || "GET").toUpperCase(),
      baseURL + config.url
    );

    return config;
  });

  return client;
}


export const authInternalApi = createInternalClient(AUTH_SERVICE_URL);
export const workspaceInternalApi = createInternalClient(WORKSPACE_SERVICE_URL);
export const groupInternalApi = createInternalClient(GROUP_SERVICE_URL);
export const utilityInternalApi = createInternalClient(UTILITY_SERVICE_URL);
