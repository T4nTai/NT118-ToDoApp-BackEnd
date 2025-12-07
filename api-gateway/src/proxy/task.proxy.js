import { TASK_SERVICE_URL } from "../config/env.js";
import { createServiceProxy } from "./createProxy.js";

export const taskProxy = createServiceProxy(TASK_SERVICE_URL);
