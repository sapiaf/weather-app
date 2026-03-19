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
import { useGeolocation } from "./hooks/useGeolocation";
import { useUnits }   from "./hooks/useUnits";
import { useTheme } from "./hooks/useTheme";
import { reverseGeocode } from "./services/weatherApi";
import { useEffect } from "react";

import "./App.css";

export default function App() {
  const { data, loading, error, history, search, fromCache } = useWeather();
  const { coords, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const { units, toggleTempUnit, toggleSpeedUnit } = useUnits();
  const { theme, toggleTheme } = useTheme();


  // Quando otteniamo le coordinate, facciamo il reverse geocoding e cerchiamo
  useEffect(() => {
    if (geoError) {
      // L'errore di geolocalizzazione viene gestito qui
      // ma non interrompiamo l'app, mostriamo solo un log
      console.warn("Geolocalizzazione error:", geoError);
    }
  }, [geoError]);

  // Handle geolocation button click
  const handleGeolocation = async () => {
    requestLocation();
  };

  // Effetto per gestire le coordinate ottenute
  useEffect(() => {
    if (coords) {
      reverseGeocode(coords.latitude, coords.longitude)
        .then(({ name }) => {
          search(name);
        })
        .catch(() => {
          // Errore silenzioso
        });
    }
  }, [coords, search]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", theme === "dark");
  }, [theme]);

  return (
    <div className={`app${theme === "dark" ? " dark-mode" : ""}`}>
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
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">{theme === "dark" ? "☀️" : "🌙"}</button>
          <div className="units-toggle">
            <button
              className={`unit-btn ${units.temperature === 'C' ? 'active' : ''}`}
              onClick={toggleTempUnit}
              aria-label="Toggle Celsius"
            >
              °C
            </button>
            <span className="unit-separator">|</span>
            <button
              className={`unit-btn ${units.temperature === 'F' ? 'active' : ''}`}
              onClick={toggleTempUnit}
              aria-label="Toggle Fahrenheit"
            >
              °F
            </button>
          </div>
        </header>

        <SearchBar
          onSearch={search}
          loading={loading}
          onGeolocation={handleGeolocation}
          geoLoading={geoLoading}
        />

        {geoError && <ErrorMessage message={geoError} />}

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
            <WeatherCard data={data} fromCache={fromCache} units={units} />
            <WeatherDetails data={data} units={units} />
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
