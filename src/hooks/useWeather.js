/**
 * useWeather.js
 * Custom hook che gestisce il fetch meteo con:
 * - Stato loading / error / data
 * - Cache localStorage con TTL di 10 minuti (feature avanzata)
 * - Storico delle ultime 5 città cercate
 *
 * @module useWeather
 */

import { useState, useCallback } from "react";
import { getWeatherByCity } from "../services/weatherApi";

/** TTL cache in millisecondi (10 minuti) */
const CACHE_TTL_MS  = 10 * 60 * 1000;
const CACHE_PREFIX  = "weather_cache_";
const HISTORY_KEY   = "weather_history";
const MAX_HISTORY   = 5;

/**
 * @typedef {Object} WeatherResult
 * @property {string} city
 * @property {string} country
 * @property {number} temperature
 * @property {number} weathercode
 * @property {number} windspeed
 * @property {number} winddirection
 * @property {number} feelsLike
 * @property {number} humidity
 * @property {number} precipProbability
 * @property {number} uvIndex
 * @property {number} fetchedAt
 */

// ─── Cache helpers ────────────────────────────────────────────────────────────

/**
 * Recupera dalla cache se non scaduta.
 * @param {string} city
 * @returns {WeatherResult|null}
 */
function getCached(city) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + city.toLowerCase());
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.fetchedAt > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + city.toLowerCase());
      return null;
    }
    return cached;
  } catch {
    return null; // localStorage non disponibile o JSON malformato
  }
}

/**
 * Salva in cache.
 * @param {WeatherResult} data
 */
function setCache(data) {
  try {
    localStorage.setItem(CACHE_PREFIX + data.city.toLowerCase(), JSON.stringify(data));
  } catch {
    // Ignoriamo errori di quota localStorage (non bloccanti)
  }
}

// ─── History helpers ──────────────────────────────────────────────────────────

/**
 * Legge lo storico città dal localStorage.
 * @returns {string[]}
 */
export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Aggiunge una città allo storico (max MAX_HISTORY, no duplicati).
 * @param {string} city
 */
function pushHistory(city) {
  try {
    const history = loadHistory().filter(c => c.toLowerCase() !== city.toLowerCase());
    history.unshift(city);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch {
    // Non bloccante
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * @returns {{
 *   data: WeatherResult|null,
 *   loading: boolean,
 *   error: string|null,
 *   history: string[],
 *   search: (city: string) => void,
 *   fromCache: boolean,
 * }}
 */
export function useWeather() {
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [history,   setHistory]   = useState(loadHistory);
  const [fromCache, setFromCache] = useState(false);

  const search = useCallback(async (cityName) => {
    const trimmed = cityName.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setFromCache(false);

    // 1. Controlla cache prima della chiamata HTTP
    const cached = getCached(trimmed);
    if (cached) {
      setData(cached);
      setFromCache(true);
      setLoading(false);
      return;
    }

    // 2. Fetch reale
    try {
      const result = await getWeatherByCity(trimmed);
      setCache(result);
      setData(result);
      pushHistory(result.city);
      setHistory(loadHistory());
    } catch (err) {
      setError(err.message ?? "Errore sconosciuto. Riprova.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, history, search, fromCache };
}
