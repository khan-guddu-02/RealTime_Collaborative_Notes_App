import db from "../config/db.js";

// CREATE LOG
export const createLog = (userId, noteId, action) => {
  return db.promise().query(
    "INSERT INTO activity_logs (user_id, note_id, action) VALUES (?, ?, ?)",
    [userId, noteId, action]
  );
};

// GET LOGS WITH USER INFO
export const getLogsByNote = (noteId) => {
  return db.promise().query(`
    SELECT 
      l.id,
      l.note_id,
      l.action,
      l.created_at,
      u.name,
      u.role
    FROM activity_logs l
    JOIN users u ON l.user_id = u.id
    WHERE l.note_id = ?
    ORDER BY l.created_at DESC
  `, [noteId]);
};