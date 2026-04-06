import express from "express";
import { getLogs } from "../controllers/activityController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected
router.use(verifyToken);

// Get logs by note
router.get("/:noteId", getLogs);

export default router