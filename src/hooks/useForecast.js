/**
 * useForecast.js
 * Custom hook per il fetch delle previsioni orarie e giornaliere.
 * Include caching in localStorage con TTL.
 *
 * @module useForecast
 */

import { useState, useCallback } from "react";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minuti
const CACHE_PREFIX = "weather_forecast_cache_";

/**
 * @typedef {Object} ForecastData
 * @property {Array} hourly - Dati orari
 * @property {Array} daily - Dati giornalieri
 * @property {number} fetchedAt - Timestamp
 */

/**
 * Recupera dalla cache se valida.
 * @param {string} key
 * @returns {ForecastData|null}
 */
function getCached(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.fetchedAt > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return cached;
  } catch {
    return null;
  }
}

/**
 * Salva in cache.
 * @param {string} key
 * @param {ForecastData} data
 */
function setCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
  } catch {
    // Ignora errori quota
  }
}

/**
 * Fetch previsioni da Open-Meteo.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<ForecastData>}
 */
async function fetchForecastData(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    hourly: "temperature_2m,weathercode",
    daily: "temperature_2m_max,temperature_2m_min,weathercode",
    timezone: "auto",
    forecast_days: "7",
    temperature_unit: "celsius",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Errore forecast (HTTP ${res.status})`);
  }

  const data = await res.json();

  // Estrai prossime 24 ore
  const now = new Date();
  const currentHour = now.getHours();
  const hourly = [];

  for (let i = currentHour; i < currentHour + 24 && i < data.hourly.time.length; i++) {
    hourly.push({
      time: data.hourly.time[i],
      temp: data.hourly.temperature_2m[i],
      code: data.hourly.weathercode[i],
    });
  }

  // Estrai 7 giorni
  const daily = data.daily.time.map((time, i) => ({
    time,
    max: data.daily.temperature_2m_max[i],
    min: data.daily.temperature_2m_min[i],
    code: data.daily.weathercode[i],
  }));

  return {
    hourly,
    daily,
    fetchedAt: Date.now(),
  };
}

/**
 * @returns {{
 *   forecast: ForecastData|null,
 *   loading: boolean,
 *   error: string|null,
 *   fromCache: boolean,
 *   fetchForecast: (lat: number, lon: number) => Promise<void>,
 * }}
 */
export function useForecast() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  const fetchForecast = useCallback(async (lat, lon) => {
    const cacheKey = `${lat.toFixed(4)}_${lon.toFixed(4)}`;

    // Controlla cache
    const cached = getCached(cacheKey);
    if (cached) {
      setForecast(cached);
      setFromCache(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setFromCache(false);

    try {
      const data = await fetchForecastData(lat, lon);
      setCache(cacheKey, data);
      setForecast(data);
    } catch (err) {
      setError(err.message || "Errore nel caricamento delle previsioni");
    } finally {
      setLoading(false);
    }
  }, []);

  return { forecast, loading, error, fromCache, fetchForecast };
}
