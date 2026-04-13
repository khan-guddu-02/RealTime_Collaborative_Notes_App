import db from "../config/db.js";

// CREATE 
export const createNote = (title, content, userId) => {
  return db
    .promise()
    .query(
      "INSERT INTO notes (title, content, owner_id) VALUES (?, ?, ?)",
      [title, content, userId]
    );
};

// ADMIN => ALL NOTES 
export const getAllNotesAdmin = () => {
  return db.promise().query(`
    SELECT 
      n.id,
      n.title,
      n.content,
      n.owner_id,
      n.created_at,
      n.updated_at,

      u.name AS username,
      u.role AS ownerRole,

      s.token AS share_token

    FROM notes n
    JOIN users u ON n.owner_id = u.id

    LEFT JOIN (
      SELECT note_id, MAX(token) AS token
      FROM share_links
      GROUP BY note_id
    ) s ON n.id = s.note_id
  `);
};

// USER => OWN + SHARED 
export const getAllNotesForUser = (userId) => {
  return db.promise().query(
    `
    SELECT 
      n.id,
      n.title,
      n.content,
      n.owner_id,
      n.created_at,     
      n.updated_at,

      u.name AS username,   
      u.role AS ownerRole,      

      s.token AS share_token,

      CASE 
        WHEN n.owner_id = ? THEN 'OWNER'
        ELSE c.role
      END AS accessRole

    FROM notes n

    JOIN users u ON n.owner_id = u.id  

    LEFT JOIN collaborators c   
      ON n.id = c.note_id 
      AND c.user_id = ?

    LEFT JOIN (
      SELECT note_id, MAX(token) AS token
      FROM share_links
      GROUP BY note_id
    ) s ON n.id = s.note_id

    WHERE 
      n.owner_id = ?
      OR c.user_id = ?
    `,
    [userId, userId, userId, userId]
  );
};

// SINGLE NOTE
export const getNoteById = (id) => {
  return db.promise().query("SELECT * FROM notes WHERE id = ?", [id]);
};

// UPDATE
export const updateNote = (id, title, content) => {
  return db
    .promise()
    .query("UPDATE notes SET title=?, content=? WHERE id=?", [
      title,
      content,
      id,
    ]);
};

//DELETE 
export const deleteNote = (id) => {
  return db.promise().query("DELETE FROM notes WHERE id = ?", [id]);
};

//SEARCH 
export const searchNotesForUser = (user, query) => {
  const role = user.role.toUpperCase();

  if (role === "ADMIN") {
    return db.promise().query(
      `
      SELECT 
        n.id,
        n.title,
        n.content,
        n.owner_id,
        n.created_at,
        n.updated_at,
        u.name AS username,
        u.role AS ownerRole
      FROM notes n
      JOIN users u ON n.owner_id = u.id
      WHERE n.title LIKE ? OR n.content LIKE ?
      `,
      [`%${query}%`, `%${query}%`]
    );
  }

  return db.promise().query(
    `
    SELECT DISTINCT 
      n.id,
      n.title,
      n.content,
      n.owner_id,
      n.created_at,
      n.updated_at,
      u.name AS username,
      u.role AS ownerRole

    FROM notes n
    JOIN users u ON n.owner_id = u.id
    LEFT JOIN collaborators c ON n.id = c.note_id

    WHERE (n.owner_id = ? OR c.user_id = ?)
    AND (n.title LIKE ? OR n.content LIKE ?)
    `,
    [user.id, user.id, `%${query}%`, `%${query}%`]
  );
};

//SHARE LINK 
export const createShareLink = (noteId, token) => {
  return db
    .promise()
    .query(
      `
      INSERT INTO share_links (note_id, token)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE token = VALUES(token)
      `,
      [noteId, token]
    );
};

// PUBLIC NOTE 
export const getNoteByShareToken = (token) => {
  return db.promise().query(
    `
    SELECT 
      n.id,
      n.title,
      n.content,
      n.created_at,
      n.updated_at,
      u.name AS username,
      u.role AS ownerRole


    FROM notes n
    JOIN share_links s ON n.id = s.note_id
    JOIN users u ON n.owner_id = u.id

    WHERE s.token = ?
    `,
    [token]
  );
};