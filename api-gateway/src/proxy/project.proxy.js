import { PROJECT_SERVICE_URL } from "../config/env.js";
import { createServiceProxy } from "./createProxy.js";

export const projectProxy = createServiceProxy(PROJECT_SERVICE_URL);
