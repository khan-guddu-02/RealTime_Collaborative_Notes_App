
import { Link, useNavigate } from "react-router-dom";
import { generateShareLink } from "../api/notesApi.js";

export default function NoteCard({ note = {}, onDelete, user }) {
  const navigate = useNavigate();

  //  USER ROLE
  const userRole = user?.role?.toUpperCase() || "";

  const isAdmin = userRole === "ADMIN";
  const isOwner = Number(note?.owner_id) === Number(user?.id);

  const ownerRole = note?.ownerRole?.toUpperCase() || "";
  const noteRole = note?.accessRole?.toUpperCase() || "";

  const isOwnerEditor = ownerRole === "EDITOR";
  // const isOwnerAdmin = ownerRole === "ADMIN";
  const isCollaboratorEditor = noteRole === "EDITOR";

  // RBAC
  const canEdit =
    isOwner || // own note
    (isAdmin && isOwnerEditor) || // admin editing editor note
    isCollaboratorEditor; // editor collaborator

  const canDelete =
    isOwner || // own
    (isAdmin && isOwnerEditor); 

  const canShare =
  isOwner || (isAdmin && isOwnerEditor);

  const canView = true;
  const canViewLogs = true;
//view handler 
  const handleView = async () => {
    try {
      let token = note?.share_token;


      if (!token) {
        const res = await generateShareLink(note.id);
        const link = res.data?.link;

        if (!link) {
          return alert("Failed to receive link");
        }

        token = link.split("/").pop();
      }

      navigate(`/share/${token}`);
    } catch (error) {
      alert("Failed to open note");
    }
  };

  const handleShare = async () => {
    try {
      const res = await generateShareLink(note.id);
      const link = res.data?.link;

      if (!link) {
        return alert("No link received");
      }

      await navigator.clipboard.writeText(link);
      alert("Share link copied!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate link");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5>{note?.title || "No Title"}</h5>

        <p>
          {note?.content ? note.content.slice(0, 80) + "..." : "No content"}
        </p>

        <p className="text-muted mb-1">
          Created by: <b>{note?.username || "Unknown"}</b> (
          {note?.ownerRole || "N/A"})
        </p>

        <small className="text-muted d-block">
          Created: {formatDate(note?.created_at)}
        </small>

        <small className="text-muted d-block mb-2">
          Updated: {formatDate(note?.updated_at)}
        </small>

        <div className="d-flex flex-wrap gap-2">
          {/* EDIT */}
          {canEdit && (
            <Link to={`/note/${note?.id}`} className="btn btn-warning btn-sm">
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

          {/* VIEW */}
          {canView && (
            <button className="btn btn-primary btn-sm" onClick={handleView}>
              View
            </button>
          )}

          {/* LOGS */}
          {canViewLogs && (
            <Link to={`/logs/${note.id}`} className="btn btn-secondary btn-sm">
              Logs
            </Link>
          )}

          {/* SHARE */}
          {canShare && (
            <button className="btn btn-info btn-sm" onClick={handleShare}>
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
