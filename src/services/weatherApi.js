/**
 * weatherApi.js
 * Servizio per le chiamate HTTP a Open-Meteo e alla sua Geocoding API.
 *
 * SICUREZZA:
 * - Open-Meteo è pubblica e non richiede API key → nessun segreto da gestire.
 * - Gli input (nome città) vengono sanitizzati con encodeURIComponent prima
 *   di essere inseriti nelle URL, prevenendo injection nelle query string.
 * - Le risposte vengono validate prima dell'uso (struttura attesa verificata).
 *
 * USO RESPONSABILE / ETICA:
 * - Rispettare i rate limit di Open-Meteo (uso non commerciale, ragionevole).
 * - Non raccogliere né trasmettere dati personali dell'utente.
 * - I dati meteo sono usati solo a scopo informativo.
 *
 * LICENZA Open-Meteo: Attribution required — CC BY 4.0
 * https://open-meteo.com/en/terms
 */

const GEO_BASE    = "https://geocoding-api.open-meteo.com/v1";
const WEATHER_BASE = "https://api.open-meteo.com/v1";

/**
 * Cerca le coordinate geografiche di una città.
 *
 * @param {string} cityName - Nome della città (input utente)
 * @returns {Promise<{ name: string, country: string, lat: number, lon: number }>}
 * @throws {Error} Se la città non viene trovata o la rete è assente
 */
export async function geocodeCity(cityName) {
  // Sanitizzazione input — mai interpolate string grezze nelle URL
  const safe = encodeURIComponent(cityName.trim());
  if (!safe) throw new Error("Il nome della città non può essere vuoto.");

  const url = `${GEO_BASE}/search?name=${safe}&count=1&language=it&format=json`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Errore geocoding (HTTP ${res.status}). Riprova più tardi.`);
  }

  const data = await res.json();

  // Validiamo la struttura della risposta prima di accedere ai campi
  if (!data.results || data.results.length === 0) {
    throw new Error(`Città "${cityName}" non trovata. Controlla l'ortografia.`);
  }

  const { name, country, latitude, longitude } = data.results[0];
  return { name, country, lat: latitude, lon: longitude };
}

/**
 * Recupera i dati meteo correnti per una coppia lat/lon.
 *
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<object>} Oggetto con current_weather e variabili orarie
 * @throws {Error} Se la risposta non è valida
 */
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude:              lat,
    longitude:             lon,
    current_weather:       "true",
    hourly:                "relativehumidity_2m,apparent_temperature,precipitation_probability,windspeed_10m,winddirection_10m,uv_index",
    forecast_days:         "1",
    timezone:              "auto",
    wind_speed_unit:       "kmh",
    temperature_unit:      "celsius",
  });

  const url = `${WEATHER_BASE}/forecast?${params}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Errore meteo (HTTP ${res.status}). Riprova più tardi.`);
  }

  const data = await res.json();

  // Validazione minima struttura risposta
  if (!data.current_weather) {
    throw new Error("Risposta API non valida: dati meteo mancanti.");
  }

  return data;
}

/**
 * Reverse geocoding: ottiene il nome della città da lat/lon.
 *
 * @param {number} lat - Latitudine
 * @param {number} lon - Longitudine
 * @returns {Promise<{ name: string, country: string }>}
 * @throws {Error} Se il reverse geocoding fallisce
 */
export async function reverseGeocode(lat, lon) {
  const url = `${GEO_BASE}/reverse?latitude=${lat}&longitude=${lon}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Errore reverse geocoding (HTTP ${res.status}). Riprova più tardi.`);
  }

  const data = await res.json();

  // Validazione risposta
  if (!data.results || data.results.length === 0) {
    throw new Error("Posizione non trovata. Prova a cercare manualmente.");
  }

  const { name, country } = data.results[0];
  return { name, country };
}

/**
 * Recupera i dati di previsione per i prossimi giorni.
 *
 * @param {number} lat
 * @param {number} lon
 * @param {number} days - Numero di giorni (default 7)
 * @returns {Promise<{ daily: object, hourly: object }>} Dati previsione giornalieri e orari
 * @throws {Error} Se la risposta non è valida
 */
export async function fetchForecast(lat, lon, days = 7) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: "temperature_2m_max,temperature_2m_min,weathercode",
    hourly: "temperature_2m,weathercode",
    forecast_days: days,
    timezone: "auto",
    temperature_unit: "celsius",
  });

  const url = `${WEATHER_BASE}/forecast?${params}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Errore previsione (HTTP ${res.status}). Riprova più tardi.`);
  }

  const data = await res.json();

  // Validazione struttura risposta
  if (!data.daily || !data.hourly) {
    throw new Error("Risposta API non valida: dati previsione mancanti.");
  }

  return {
    daily: data.daily,
    hourly: data.hourly,
    fetchedAt: Date.now(),
  };
}

/**
 * Entry point combinato: geocoding → forecast.
 * Restituisce un oggetto normalizzato pronto per la UI.
 *
 * @param {string} cityName
 * @returns {Promise<import('../hooks/useWeather').WeatherResult>}
 */
export async function getWeatherByCity(cityName) {
  const geo     = await geocodeCity(cityName);
  const weather = await fetchWeather(geo.lat, geo.lon);

  // Prendiamo l'indice orario più vicino all'ora corrente
  const now     = new Date();
  const hourIdx = now.getHours(); // open-meteo restituisce 24 slot orari

  const h = weather.hourly;

  return {
    city:    geo.name,
    country: geo.country,
    lat:     geo.lat,
    lon:     geo.lon,

    // Dati correnti
    temperature:          weather.current_weather.temperature,
    weathercode:          weather.current_weather.weathercode,
    windspeed:            weather.current_weather.windspeed,
    winddirection:        weather.current_weather.winddirection,

    // Dati orari all'ora corrente
    feelsLike:            h.apparent_temperature?.[hourIdx],
    humidity:             h.relativehumidity_2m?.[hourIdx],
    precipProbability:    h.precipitation_probability?.[hourIdx],
    uvIndex:              h.uv_index?.[hourIdx],

    fetchedAt: Date.now(),
  };
}
