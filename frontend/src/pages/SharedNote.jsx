import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicNote } from "../api/notesApi.js"; 

export default function SharedNote() {
  const { token } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

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
    return <p className="text-center mt-4">Loading note...</p>;
  }


  if (!note) {
    return (
      <div className="text-center mt-5">
        <h4>Note not found or link expired</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4 col-md-8">
      <h2>{note.title}</h2>

      <p>{note.content || "No content available"}</p>
    </div>
  );
}