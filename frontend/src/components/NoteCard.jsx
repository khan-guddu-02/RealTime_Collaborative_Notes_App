import { Link } from "react-router-dom";
import { generateShareLink } from "../api/notesApi.js";

export default function NoteCard({ note = {}, onDelete, user }) {
  console.log("NOTE DATA:", note);

  const userRole = user?.role?.toUpperCase?.() || "";

  const isAdmin = userRole === "ADMIN";
  const isOwner = Number(note?.owner_id) === Number(user?.id);

  //  SAFE ROLE (fallback)
  const noteRole = note?.role?.toUpperCase?.() || "";

  const isCollaboratorEditor = noteRole === "EDITOR";
  const isViewer = noteRole === "VIEWER";

  //  RBAC
  const canEdit = isAdmin || isOwner || isCollaboratorEditor;
  const canDelete = isAdmin;
  const canShare = isAdmin || isOwner;

  //  SHARE HANDLER
  const handleShare = async () => {
    try {
      const res = await generateShareLink(note.id);
      const link = res.data?.link;

      if (!link) {
        alert("No link received");
        return;
      }

      await navigator.clipboard.writeText(link);
      alert("Share link copied!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate link");
    }
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5>{note?.title || "No Title"}</h5>

        <p>
          {note?.content
            ? note.content.slice(0, 80) + "..."
            : "No content"}
        </p>

        <div className="d-flex flex-wrap gap-2">
          
          {/* EDIT */}
          {canEdit && (
            <Link
              to={`/note/${note?.id}`}
              className="btn btn-warning btn-sm"
            >
              Edit
            </Link>
          )}

          {/* DELETE */}
          {canDelete && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(note?.id)}
            >
              Delete
            </button>
          )}

          {/* SHARE */}
          {canShare && (
            <button
              className="btn btn-info btn-sm"
              onClick={handleShare}
            >
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}