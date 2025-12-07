import { AUTH_SERVICE_URL } from "../config/env.js";
import { createServiceProxy } from "./createProxy.js";

export const authProxy = createServiceProxy(AUTH_SERVICE_URL);
