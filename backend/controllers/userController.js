import asyncHandler from "../utils/asyncHandler.js";
import { getAllUsers, deleteUser } from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import { ROLES } from "../utils/constants.js";

// GET ALL USERS (Admin only)
export const getUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new ApiError(403, "Only admin can view users");
  }

  const [users] = await getAllUsers();

  res.status(200).json({
    success: true,
    users,
  });
});

// DELETE USER (optional)
export const removeUser = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new ApiError(403, "Only admin can delete users");
  }

  const { id } = req.params;

  await deleteUser(id);

  res.json({ message: "User deleted" });
});