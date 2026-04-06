import crypto from "crypto";
import db from "../config/db.js";
import {
  createNote,
  getAllNotesAdmin,
  getAllNotesForUser,
  updateNote,
  deleteNote,
  getNoteById,
  searchNotesForUser,
  createShareLink,
  getNoteByShareToken
} from "../models/noteModel.js";

import { findCollaborator } from "../models/collaborationModel.js";
import { createLog } from "../models/activityLogModel.js";
import { ROLES, ACTIONS } from "../utils/constants.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";


const checkAccess = async (noteId, user) => {
  const [notes] = await getNoteById(noteId);

  if (notes.length === 0) {
    throw new ApiError(404, "Note not found");
  }

  const note = notes[0];
  const role = user.role.toUpperCase();

  // ADMIN  full access
  if (role === ROLES.ADMIN) return ROLES.ADMIN;

  // OWNER → editor
  if (note.owner_id === user.id) return ROLES.EDITOR;

  //  COLLABORATOR
  const [collab] = await findCollaborator(noteId, user.id);
  if (collab.length > 0) {
    return collab[0].role.toUpperCase();
  }

  throw new ApiError(403, "Access denied");
};

// CREATE NOTE

export const create = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title & content required");
  }

  if (req.user.role === ROLES.VIEWER) {
    throw new ApiError(403, "Viewer cannot create notes");
  }

  const [result] = await createNote(title, content, req.user.id);

  await createLog(req.user.id, result.insertId, ACTIONS.CREATE);

  res.status(201).json({
    message: "Note created",
    noteId: result.insertId,
  });
});

// GET ALL NOTES 
 
export const getAll = asyncHandler(async (req, res) => {
  const role = req.user.role.toUpperCase();

  let notes;

  if (role === ROLES.ADMIN) {
    // admin -> all notes
    const [rows] = await getAllNotesAdmin();
    notes = rows;
  } else {
    //editor / viewer -> own + shared
    const [rows] = await getAllNotesForUser(req.user.id);
    notes = rows;
  }

  res.json(notes);
});

// GET SINGLE NOTE
 
export const getSingleNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await checkAccess(id, req.user);

  const [notes] = await getNoteById(id);

  res.json(notes[0]);
});

// UPDATE NOTE
 
export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title && !content) {
    throw new ApiError(400, "Nothing to update");
  }

  const role = await checkAccess(id, req.user);

  if (role === ROLES.VIEWER) {
    throw new ApiError(403, "Viewer cannot edit");
  }

  const [notes] = await getNoteById(id);
  const note = notes[0];

  await updateNote(
    id,
    title || note.title,
    content || note.content
  );

  await createLog(req.user.id, id, ACTIONS.UPDATE);

  res.json({ message: "Note updated" });
});

// DELETE NOTE
 
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [notes] = await getNoteById(id);

  if (notes.length === 0) {
    throw new ApiError(404, "Note not found");
  }

  const role = req.user.role.toUpperCase();

  if (role !== ROLES.ADMIN) {
    throw new ApiError(403, "Only admin can delete");
  }

  await db.promise().query(
    "DELETE FROM activity_logs WHERE note_id = ?",
    [id]
  );

  await deleteNote(id);

  res.json({ message: "Note deleted successfully" });
});

// SEARCH NOTES
 
export const search = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new ApiError(400, "Search query required");
  }

  const [results] = await searchNotesForUser(req.user, q);

  res.json(results);
});

// SHARE LINK

export const generateShare = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await checkAccess(id, req.user);

  if (role === ROLES.VIEWER) {
    return res.status(403).json({ message: "No permission to share" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  await createShareLink(id, token);

  await createLog(req.user.id, id, ACTIONS.SHARE);

  return res.json({
    link: `http://localhost:5000/api/notes/public/${token}`,
  });
});

// PUBLIC NOTE
 
export const getPublicNote = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const [notes] = await getNoteByShareToken(token);

  if (notes.length === 0) {
    throw new ApiError(404, "Invalid link");
  }

  res.json(notes[0]);
});