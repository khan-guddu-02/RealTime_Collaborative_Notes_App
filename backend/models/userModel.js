import db from "../config/db.js";

//Create new user

export const createUser = (name, email, password, role) => {
  return db.promise().query(
    `INSERT INTO users (name, email, password, role) 
     VALUES (?, ?, ?, ?)`,
    [name, email, password, role]
  );
};

//Find user by email (for login)

export const findUserByEmail = (email) => {
  return db.promise().query(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
};

// Find user by ID (for JWT auth middleware)

export const findUserById = (id) => {
  return db.promise().query(
    `SELECT id, name, email, role FROM users WHERE id = ?`,
    [id]
  );
};

//Check if email already exists (IMPORTANT)

export const checkEmailExists = (email) => {
  return db.promise().query(
    `SELECT id FROM users WHERE email = ?`,
    [email]
  );
};

//Get all users (Admin use)
 
export const getAllUsers = () => {
  return db.promise().query(
    `SELECT id, name, email, role FROM users`
  );
};

// Delete user (Admin only)

export const deleteUser = (id) => {
  return db.promise().query(
    `DELETE FROM users WHERE id = ?`,
    [id]
  );
};  