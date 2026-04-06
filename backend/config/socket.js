import { Server } from "socket.io";
import { noteSocketHandler } from "../sockets/noteSocket.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    noteSocketHandler(io, socket);
  });

  return io;
};