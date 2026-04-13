
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoteById, updateNote } from "../api/notesApi.js";
import { addCollaborator } from "../api/collaborationApi.js";
import { getUsers } from "../api/userApi.js";
import Editor from "../components/Editor.jsx";
import { AuthContext } from "../context/AuthContext";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [note, setNote] = useState(null);
  const [users, setUsers] = useState([]);
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

  //  FETCH USERS 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data.users);
      } catch (err) {
        console.error("User fetch failed");
      }
    };

    fetchUsers();
  }, []);

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

  //  ADD COLLAB 
  const handleAddCollab = async () => {
    if (!collabUserId) return alert("Select a user");

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
  const canManageCollab =
    userRole === "ADMIN" || Number(note.owner_id) === Number(user?.id);

  return (
    <div className="container mt-4 col-md-8">
      {/* MAIN CARD */}
      <div className="card shadow p-4">
        <h4 className="mb-3">
          {" "}
          <span className="me-2">📝</span> Edit Note
        </h4>

        {/* TITLE */}
        <input
          className="form-control mb-3"
          placeholder="Enter title"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          disabled={isViewer}
        />

        {/* EDITOR */}
        <Editor
          value={note.content}
          noteId={id}
          onChange={(val) => setNote({ ...note, content: val })}
        />

        {/* SAVE BUTTON */}
        {!isViewer && (
          <button
            className="btn btn-primary mt-3 w-100"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Saving..." : " Save Changes"}
          </button>
        )}
      </div>

      {/*  COLLAB SECTION  */}
      {canManageCollab && (
        <div className="card mt-4 p-3 shadow-sm">
          <h5>👥 Add Collaborator</h5>

          {/* USER DROPDOWN */}
          <select
            className="form-control mb-2"
            value={collabUserId}
            onChange={(e) => setCollabUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>

          {/* ROLE */}
          <select
            className="form-control mb-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="EDITOR">Editor</option>
            <option value="VIEWER">Viewer</option>
          </select>

          {/* ADD BUTTON */}
          <button className="btn btn-secondary w-100" onClick={handleAddCollab}>
            Add Collaborator
          </button>
        </div>
      )}
    </div>
  );
}
