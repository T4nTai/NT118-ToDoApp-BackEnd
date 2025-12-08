import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config/env.js";

let io = null;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("NO_TOKEN"));

    try {
      const user = jwt.verify(token, JWT_SECRET);
      socket.user_id = user.id;
      return next();
    } catch (err) {
      return next(new Error("INVALID_TOKEN"));
    }
  });

  io.on("connection", (socket) => {
    const user_id = socket.user_id;

    socket.join(`user_${user_id}`);
    console.log(`User ${user_id} connected via socket`);

    socket.on("disconnect", () => {
      console.log(`User ${user_id} disconnected`);
    });
  });

  return io;
}

export { io };
