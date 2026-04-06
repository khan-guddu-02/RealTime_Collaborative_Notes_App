import db from "../config/db.js";

// Create Activity Log
export const createLog = (userId, noteId, action) => {
  return db.promise().query(
    "INSERT INTO activity_logs (user_id, note_id, action) VALUES (?, ?, ?)",
    [userId, noteId, action]
  );
};

//  Get Logs by Note
export const getLogsByNote = (noteId) => {
  return db.promise().query(
    "SELECT * FROM activity_logs WHERE note_id = ? ORDER BY created_at DESC",
    [noteId]
  );
};