/**
 * SearchBar.jsx
 * Input di ricerca con bottone, submit da tastiera (Enter) e geolocalizzazione.
 */

import { useState } from "react";

/**
 * @param {{
 *   onSearch: (city: string) => void,
 *   loading: boolean,
 *   onGeolocation?: () => void,
 *   geoLoading?: boolean
 * }} props
 */
export default function SearchBar({ onSearch, loading, onGeolocation, geoLoading }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value);
  };

  const handleGeoClick = () => {
    if (onGeolocation) onGeolocation();
  };

  return (
    <div className="search-bar">
      <label htmlFor="city-search" className="sr-only">
        Cerca una città
      </label>
      <input
        id="city-search"
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
        onClick={handleGeoClick}
        disabled={loading || geoLoading}
        aria-label="Usa la mia posizione"
        className="geo-button"
        title="Usa la mia posizione"
      >
        {geoLoading ? <span className="spinner" /> : "📍"}
      </button>
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
