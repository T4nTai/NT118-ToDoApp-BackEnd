import { GROUP_SERVICE_URL } from "../config/env.js";
import { createServiceProxy } from "./createProxy.js";

export const groupProxy = createServiceProxy(GROUP_SERVICE_URL);
