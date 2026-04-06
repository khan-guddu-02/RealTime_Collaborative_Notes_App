import express from "express";
import {
  create,
  getAll,
  update,
  remove,
  search,
  generateShare,
  getPublicNote,
  getSingleNote,
} from "../controllers/noteController.js";


import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
//  PUBLIC ROUTE (No Auth Required)

router.get("/public/:token", getPublicNote);
// PROTECTED ROUTES (JWT Required)

router.use(verifyToken);
//  SEARCH (keep above /:id to avoid conflict)

router.get("/search", search);
//  NOTES CRUD

router.post("/", create);        // Create note
router.get("/", getAll);         // Get all notes (RBAC applied)
router.get("/:id", getSingleNote); // Get single note
router.put("/:id", update);      // Update note
router.delete("/:id", remove);   // Delete note (admin only)

// SHARE NOTE
 
router.post("/:id/share",verifyToken, generateShare);

export default router;