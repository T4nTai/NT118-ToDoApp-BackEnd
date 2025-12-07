import { WORKSPACE_SERVICE_URL } from "../config/env.js";
import { createServiceProxy } from "./createProxy.js";

export const workspaceProxy = createServiceProxy(WORKSPACE_SERVICE_URL);
