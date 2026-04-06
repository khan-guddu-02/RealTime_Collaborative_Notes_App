import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { initSocket } from "./config/socket.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

await connectDB();

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
