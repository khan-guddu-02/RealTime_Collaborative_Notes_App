import API from "./axios";

export const getUsers = () => {
  return API.get("/users");
};