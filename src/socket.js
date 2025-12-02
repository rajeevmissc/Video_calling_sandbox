// socket.js
import { io } from "socket.io-client";

export const socket = io(
  process.env.REACT_APP_BACKEND_URL || "https://socket-server-d9ts.onrender.com",
  {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
  }
);
