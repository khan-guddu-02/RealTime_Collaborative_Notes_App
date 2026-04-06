import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getNotes, deleteNote, searchNotes } from "../api/notesApi.js";
import NoteCard from "../components/NoteCard";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async (query = "") => {
    try {
      setLoading(true);

      const res = query ? await searchNotes(query) : await getNotes();

      console.log(" API RAW:", res.data);

    
      setNotes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(" Fetch error:", err);
      setNotes([]);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setLoading(false);
    }
  }, [user]);


  if (authLoading) return <p>Checking login...</p>;
  if (loading) return <p>Loading...</p>;

  console.log("AUTH LOADING:", authLoading);
  console.log("DASHBOARD LOADING:", loading);

  //  Delete
  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="container mt-4">
      <Link to="/create" className="btn btn-success mb-3">
        + Create Note
      </Link>

      <SearchBar onSearch={fetchNotes} />
      <div className="row">
        {notes.length === 0 ? (
          <p>No notes found</p>
        ) : (
          notes.map((note) => (
            <div className="col-md-4" key={note.id}>
              <NoteCard note={note} onDelete={handleDelete} user={user} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
