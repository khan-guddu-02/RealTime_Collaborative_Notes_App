

export const noteSocketHandler = (io, socket) => {
  console.log("Socket connected:", socket.id);


  socket.on("join-note", (noteId) => {
    socket.join(noteId);
    console.log(`User joined note ${noteId}`);
  });


  socket.on("leave-note", (noteId) => {
    socket.leave(noteId);
  });


  socket.on("edit-note", ({ noteId, content }) => {
    socket.to(noteId).emit("receive-update", content); 
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}