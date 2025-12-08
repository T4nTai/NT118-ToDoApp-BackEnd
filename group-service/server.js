import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import app from "./src/app.js";

const PORT = process.env.PORT || 4003;

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Group service is running on port ${PORT}`);
});
