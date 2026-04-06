import API from "./axios";

// Add collaborator
export const addCollaborator = (data) => {
  return API.post("/collaborators", data); 
};

// Get collaborators of a note
export const getCollaborators = (noteId) => {
  return API.get(`/collaborators/${noteId}`); 
};