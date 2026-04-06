import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="mb-3 d-flex gap-2">
      <input
        type="text"
        className="form-control"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}