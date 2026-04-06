import { getIO } from "../config/socket.js";

const emitNoteUpdate = (noteId, content) => {
  const io = getIO();
  io.to(noteId).emit("receive-update", content);
};

export { emitNoteUpdate };