import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicNote } from "../api/notesApi.js";

export default function SharedNote() {
  const { token } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };


  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);

        const res = await getPublicNote(token);
        setNote(res.data);

      } catch (err) {
        alert(err.response?.data?.message || "Invalid or expired link");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchNote();
  }, [token]);

  if (loading) {
    return <p className="text-center mt-5">Loading note...</p>;
  }

  if (!note) {
    return (
      <div className="text-center mt-5">
        <h4> Note not found or link expired</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5 col-md-8">
      <div className="card shadow p-4">

     
        <h2 className="mb-3">{note.title}</h2>

   
        <p style={{ whiteSpace: "pre-wrap" }}>
          {note?.content || "No content available"}
        </p>

        <hr />

         <small className="text-muted d-block">
          Created By: {note?.username || "Unknown"} ({note?.ownerRole || "N/A"})
        </small>
         <small className="text-muted d-block">
          Created: {formatDate(note?.created_at)}
        </small>
        <small className="text-muted d-block mb-2">
          Updated: {formatDate(note?.updated_at)}
        </small>

       
        <p className="text-danger mt-3">
          🔒 This is a read-only shared note
        </p>

      </div>
    </div>
  );
}