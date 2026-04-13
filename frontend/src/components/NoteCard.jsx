import { Link } from "react-router-dom";
import { generateShareLink } from "../api/notesApi.js";
import { useNavigate } from "react-router-dom";

export default function NoteCard({ note = {}, onDelete, user }) {



  const userRole = user?.role?.toUpperCase?.() || "";

  const isAdmin = userRole === "ADMIN";
  const isOwner = Number(note?.owner_id) === Number(user?.id);

  const noteRole = note?.accessRole?.toUpperCase?.() || "";

  const isCollaboratorEditor = noteRole === "EDITOR";

  // RBAC
  const canEdit = isAdmin || isOwner || isCollaboratorEditor;
  const canDelete = isAdmin;
  const canShare = isAdmin || isOwner;


  const navigate = useNavigate();

  const handleView = async()=>{
    try {
          let token = note?.share_token;

          if(!token){
            const res = await generateShareLink(note.id);
            const link = res.data?.link;
            if (!link) {
              alert("Failed to receive link");
            }

            token=link.split("/").pop();
          }

          navigate(`/share/${token}`)
    } catch (error) {
      alert("Failed to open note")
    }
  }

  //  Format Date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

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
          {canEdit && (
            <Link to={`/note/${note?.id}`} className="btn btn-warning btn-sm">
              Edit
            </Link>
          )}

          {canDelete && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(note?.id)}
            >
              Delete
            </button>
          )}

          
           <button className="btn btn-primary btn-sm" onClick={handleView}>
            view
           </button>

          <Link to={`/logs/${note.id}`} className="btn btn-secondary btn-sm">
            Logs
          </Link>

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
