import API from "./axios";

//  Get all activity logs
export const getActivityLogs = () => {
  return API.get("/activity");
};