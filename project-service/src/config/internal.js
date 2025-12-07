import axios from "axios";
import { INTERNAL_SERVICE_KEY } from "./env.js";

export const internalApi = axios.create({
  headers: {
    "x-internal-key": INTERNAL_SERVICE_KEY
  },
  timeout: 5000
});