import db from "../config/db.js";

// Find collaborator
 
export const findCollaborator = (noteId, userId) => {
  return db.promise().query(
    "SELECT * FROM collaborators WHERE note_id=? AND user_id=?",
    [noteId, userId]
  );
};

// Add collaborator
 
export const addCollaborator = (noteId, userId, role) => {
  return db.promise().query(
    "INSERT INTO collaborators (note_id, user_id, role) VALUES (?, ?, ?)",
    [noteId, userId, role] 
  );
};

// Get all collaborators of a note
 
export const getCollaborators = (noteId) => {
  return db.promise().query(
    `SELECT c.*, u.name, u.email 
     FROM collaborators c
     JOIN users u ON c.user_id = u.id
     WHERE c.note_id = ?`,
    [noteId]
  );
};

// Remove collaborator 
 
export const removeCollaborator = (noteId, userId) => {
  return db.promise().query(
    "DELETE FROM collaborators WHERE note_id=? AND user_id=?",
    [noteId, userId]
  );
};