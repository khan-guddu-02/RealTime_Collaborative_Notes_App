import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoteById, updateNote } from "../api/notesApi.js";
import { addCollaborator } from "../api/collaborationApi.js";
import Editor from "../components/Editor.jsx";
import { AuthContext } from "../context/AuthContext";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

  const [collabUserId, setCollabUserId] = useState("");
  const [role, setRole] = useState("EDITOR");

  const userRole = user?.role;

  //  FETCH NOTE
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await getNoteById(id);
        setNote(res.data);
      } catch (err) {
        alert("Failed to load note");
      }
    };

    fetchNote();
  }, [id]);

  //  UPDATE NOTE
  const handleUpdate = async () => {
    if (!note.title || !note.content) {
      return alert("Title and content required");
    }

    try {
      setLoading(true);

      await updateNote(id, {
        title: note.title,
        content: note.content,
      });

      alert("Updated successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ADD COLLABORATOR
  const handleAddCollab = async () => {
    if (!collabUserId) return alert("User ID required");

    try {
      await addCollaborator({
        noteId: id,
        userId: collabUserId,
        role,
      });

      alert("Collaborator added");
      setCollabUserId("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add collaborator");
    }
  };

  if (!note) return <p className="text-center mt-4">Loading...</p>;

  const isViewer = userRole === "VIEWER";

  return (
    <div className="container mt-4 col-md-8">
      <h3>Edit Note</h3>

      {/* TITLE */}
      <input
        className="form-control mb-3"
        value={note.title}
        onChange={(e) =>
          setNote({ ...note, title: e.target.value })
        }
        disabled={isViewer}
      />

      {/* EDITOR */}
      <Editor
        value={note.content}
        noteId={id}
        onChange={(val) =>
          setNote({ ...note, content: val })
        }
      />

      {/* SAVE BUTTON */}
      {!isViewer && (
        <button
          className="btn btn-primary mt-3 w-100"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      )}

      {/* COLLABORATION */}
      {(userRole === "ADMIN" ||
        Number(note.owner_id) === Number(user?.id)) && (
        <div className="mt-4">
          <h5>Add Collaborator</h5>

          <input
            className="form-control mb-2"
            placeholder="User ID"
            value={collabUserId}
            onChange={(e) => setCollabUserId(e.target.value)}
          />

          <select
            className="form-control mb-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="EDITOR">Editor</option>
            <option value="VIEWER">Viewer</option>
          </select>

          <button
            className="btn btn-secondary w-100"
            onClick={handleAddCollab}
          >
            Add Collaborator
          </button>
        </div>
      )}
    </div>
  );
}