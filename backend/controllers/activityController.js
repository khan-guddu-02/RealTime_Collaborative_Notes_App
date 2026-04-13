import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { getLogsByNote } from "../models/activityLogModel.js";
import { getNoteById } from "../models/noteModel.js";
import { findCollaborator } from "../models/collaborationModel.js";
import { ROLES } from "../utils/constants.js";

// ACCESS CHECK
const checkAccess = async (noteId, user) => {

  //  SAFE USER CHECK
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const [notes] = await getNoteById(noteId);

  if (!notes || notes.length === 0) {
    throw new ApiError(404, "Note not found");
  }

  const note = notes[0];

  // ADMIN
  if (user.role === ROLES.ADMIN) return true;

  // OWNER
  if (Number(note.owner_id) === Number(user.id)) return true;

  // COLLABORATOR (SAFE)
  let collab = [];
  try {
    const result = await findCollaborator(noteId, user.id);
    collab = result?.[0] || [];
  } catch (err) {
    console.log("Collaborator check error:", err);
  }

  if (collab.length > 0) return true;

  throw new ApiError(403, "Not authorized to view logs");
};

// GET LOGS
export const getLogs = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  await checkAccess(noteId, req.user);

  const [logs] = await getLogsByNote(noteId);

  const formattedLogs = (logs || []).map(log => ({
    action: log.action,
    username: log.username,
    role: log.role,
    time: log.created_at
  }));

  res.status(200).json({
    success: true,
    count: formattedLogs.length,
    logs: formattedLogs
  });
});