import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { ROLES, ACTIONS } from "../utils/constants.js";

import {
  addCollaborator,
  getCollaborators,
  findCollaborator,
} from "../models/collaborationModel.js";

import { getNoteById } from "../models/noteModel.js";
import { createLog } from "../models/activityLogModel.js";

// Access check (OWNER + ADMIN)
const canManage = async (noteId, user) => {
  const [notes] = await getNoteById(noteId);

  if (notes.length === 0) {
    throw new ApiError(404, "Note not found");
  }

  const note = notes[0];

  //normalize role
  const userRole = user.role.toUpperCase();

  if (userRole === ROLES.ADMIN) return true;

  if (note.owner_id === user.id) return true;

  throw new ApiError(403, "Only owner/admin can manage collaborators");
};

//ADD COLLABORATOR

export const add = asyncHandler(async (req, res) => {
  const { noteId, userId, role } = req.body;

  if (!noteId || !userId || !role) {
    throw new ApiError(400, "All fields required");
  }

  //  normalize role 
  const inputRole = role.toUpperCase();

  // role validation
  if (![ROLES.EDITOR, ROLES.VIEWER].includes(inputRole)) {
    throw new ApiError(400, "Invalid role");
  }

  // access check
  await canManage(noteId, req.user);

  // prevent owner self-add
  const [notes] = await getNoteById(noteId);
  if (notes[0].owner_id === userId) {
    throw new ApiError(400, "Owner already has full access");
  }

  // duplicate check
  const [existing] = await findCollaborator(noteId, userId);
  if (existing.length > 0) {
    throw new ApiError(400, "User already collaborator");
  }

  // use normalized role
  await addCollaborator(noteId, userId, inputRole);

  await createLog(req.user.id, noteId, ACTIONS.SHARE);

  res.status(201).json({
    message: "Collaborator added successfully",
  });
});

//GET COLLABORATORS

export const getAll = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const [notes] = await getNoteById(noteId);

  if (notes.length === 0) {
    throw new ApiError(404, "Note not found");
  }

  const note = notes[0];

  let allowed = false;

  const userRole = req.user.role.toUpperCase();

  if (userRole === ROLES.ADMIN) {
    allowed = true;
  } else if (note.owner_id === req.user.id) {
    allowed = true;
  } else {
    const [collab] = await findCollaborator(noteId, req.user.id);
    if (collab.length > 0) allowed = true;
  }

  if (!allowed) {
    throw new ApiError(403, "Not authorized");
  }

  const [collaborators] = await getCollaborators(noteId);

  res.json(collaborators);
});