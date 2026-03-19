/**
 * App.jsx
 * Componente radice. Orchestratore dei componenti e dello stato globale.
 */

import SearchBar      from "./components/SearchBar";
import WeatherCard    from "./components/WeatherCard";
import WeatherDetails from "./components/WeatherDetails";
import ErrorMessage   from "./components/ErrorMessage";
import CityHistory    from "./components/CityHistory";
import { useWeather } from "./hooks/useWeather";
import "./App.css";

export default function App() {
  const { data, loading, error, history, search, fromCache } = useWeather();

  return (
    <div className="app">
      {/* Sfondo decorativo */}
      <div className="bg-orb bg-orb--1" aria-hidden="true" />
      <div className="bg-orb bg-orb--2" aria-hidden="true" />

      <main className="container">
        <header className="header">
          <h1 className="title">
            <span className="title-icon">🌍</span>
            Meteo
          </h1>
          <p className="subtitle">Dati in tempo reale · Open-Meteo</p>
        </header>

        <SearchBar onSearch={search} loading={loading} />

        <CityHistory history={history} onSelect={search} />

        {/* Stato: errore */}
        {error && <ErrorMessage message={error} />}

        {/* Stato: loading placeholder */}
        {loading && (
          <div className="skeleton-wrap">
            <div className="skeleton skeleton--card" />
            <div className="skeleton skeleton--details" />
          </div>
        )}

        {/* Stato: dati disponibili */}
        {!loading && data && (
          <div className="results">
            <WeatherCard data={data} fromCache={fromCache} />
            <WeatherDetails data={data} />
            <p className="attribution">
              Dati forniti da{" "}
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open-Meteo
              </a>{" "}
              · Licenza CC BY 4.0
            </p>
          </div>
        )}

        {/* Stato: empty (nessuna ricerca ancora) */}
        {!loading && !data && !error && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>Inserisci una città per iniziare</p>
          </div>
        )}
      </main>
    </div>
  );
}
