/**
 * SearchBar.jsx
 * Input di ricerca con bottone e submit da tastiera (Enter).
 */

import { useState } from "react";

/**
 * @param {{ onSearch: (city: string) => void, loading: boolean }} props
 */
export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
        placeholder="Cerca una città..."
        disabled={loading}
        aria-label="Nome della città"
        maxLength={100}
        autoComplete="off"
        spellCheck="false"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !value.trim()}
        aria-label="Cerca meteo"
      >
        {loading ? <span className="spinner" /> : "→"}
      </button>
    </div>
  );
}
