import express from "express";
import {
  add,
  getAll
} from "../controllers/collaborationController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.use(verifyToken);

// Add collaborator
router.post("/", add);

// Get collaborators of a note
router.get("/:noteId", getAll);

export default router;