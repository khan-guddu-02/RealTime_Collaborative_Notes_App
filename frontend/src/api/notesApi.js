import API from "./axios";

//  Create Note
export const createNote = (data) => {
  return API.post("/notes", data);
};

//  Get All Notes
export const getNotes = () => {
  return API.get("/notes");
};

// Search Notes
export const searchNotes = (query) => {
  return API.get(`/notes/search?q=${query}`); 
};

//  Get Single Note by ID
export const getNoteById = (id) => {
  return API.get(`/notes/${id}`);
};

//  Update Note
export const updateNote = (id, data) => {
  return API.put(`/notes/${id}`, data);
};

//Delete Note
export const deleteNote = (id) => {
  return API.delete(`/notes/${id}`);
};

// Generate Share Link
export const generateShareLink = (id) => {
  return API.post(`/notes/${id}/share`);
};

// Get Public Note (no auth required)
export const getPublicNote = (token) => {
  return API.get(`/notes/public/${token}`);
};