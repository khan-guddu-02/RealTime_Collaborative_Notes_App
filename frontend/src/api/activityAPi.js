import API from "./axios";

export const getActivityLogs = (noteId) => {
  return API.get(`/activity/${noteId}`);
};