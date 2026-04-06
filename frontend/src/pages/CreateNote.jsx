import { useState, useContext } from "react";
import { createNote } from "../api/notesApi.js";
import { useNavigate } from "react-router-dom";
import Editor from "../components/Editor";
import { AuthContext } from "../context/AuthContext";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isViewer = user?.role === "VIEWER";

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      return alert("Title and content required");
    }

    try {
      setLoading(true);

      await createNote({ title, content });

      alert("Note created successfully");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //  Viewer block
  if (isViewer) {
    return (
      <div className="container mt-5 text-center">
        <h4>You don't have permission to create notes</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4 col-md-8">
      <h3>Create Note</h3>

      {/* TITLE */}
      <input
        className="form-control mb-3"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* EDITOR */}
      <Editor value={content} onChange={setContent} />

      {/* BUTTON */}
      <button
        className="btn btn-primary mt-3 w-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Note"}
      </button>
    </div>
  );
}