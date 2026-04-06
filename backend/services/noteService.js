import db from "../config/db.js";

const updateNoteContent = (noteId, content, cb) => {
  db.query(
    "UPDATE notes SET content = ?, updated_at = NOW() WHERE id = ?",
    [content, noteId],
    cb
  );
};

export { updateNoteContent };