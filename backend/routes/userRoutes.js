import express from "express";
import { getUsers, removeUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected
router.use(verifyToken);

// GET USERS
router.get("/", getUsers);

// DELETE USER (optional)
router.delete("/:id", removeUser);

export default router;