import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { getLogsByNote } from "../models/activityLogModel.js";
import { getNoteById } from "../models/noteModel.js";
import { findCollaborator } from "../models/collaborationModel.js";
import { ROLES } from "../utils/constants.js";


const checkAccess = async (noteId, user) => {
  const [notes] = await getNoteById(noteId);

  if (notes.length === 0) {
    throw new ApiError(404, "Note not found");
  }

  const note = notes[0];

  // ADMIN override
  if (user.role === ROLES.ADMIN) {
    return true;
  }

  // OWNER
  if (note.owner_id === user.id) {
    return true;
  }

  
  const [collab] = await findCollaborator(noteId, user.id);

  if (collab.length > 0) {
    return true;
  }

  throw new ApiError(403, "Not authorized to view logs");
};


export const getLogs = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  await checkAccess(noteId, req.user);

  const [logs] = await getLogsByNote(noteId);

  res.status(200).json({
    success: true,
    count: logs.length,
    logs,
  });
});