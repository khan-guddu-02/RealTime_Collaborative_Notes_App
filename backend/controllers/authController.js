import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

import {
  createUser,
  findUserByEmail,
  checkEmailExists
} from "../models/userModel.js";

import { ROLES } from "../utils/constants.js";

// REGISTER
 
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields required");
  }

  // Check duplicate email
  const [existing] = await checkEmailExists(email);
  if (existing.length > 0) {
    throw new ApiError(400, "Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Default role = viewer (safe)
  const userRole = role || ROLES.VIEWER;

  const [result] = await createUser(
    name,
    email,
    hashedPassword,
    userRole
  );

  res.status(201).json({
    message: "User registered successfully",
    userId: result.insertId,
  });
});

// LOGIN
 
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const [users] = await findUserByEmail(email);

  if (users.length === 0) {
    throw new ApiError(401, "Invalid credentials");
  }

  const user = users[0];

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});