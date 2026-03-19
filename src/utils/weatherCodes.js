/**
 * weatherCodes.js
 * Mappa i codici WMO (World Meteorological Organization) usati da Open-Meteo
 * in descrizioni leggibili e icone emoji.
 *
 * Riferimento: https://open-meteo.com/en/docs#weathervariables
 */

/** @typedef {{ label: string, emoji: string, bg: string }} WeatherInfo */

/** @type {Record<number, WeatherInfo>} */
export const WMO_CODES = {
  0:  { label: "Cielo sereno",            emoji: "☀️",  bg: "#FFF9C4" },
  1:  { label: "Prevalentemente sereno",  emoji: "🌤️", bg: "#FFF9C4" },
  2:  { label: "Parzialmente nuvoloso",   emoji: "⛅",  bg: "#E3F2FD" },
  3:  { label: "Coperto",                 emoji: "☁️",  bg: "#CFD8DC" },
  45: { label: "Nebbia",                  emoji: "🌫️", bg: "#ECEFF1" },
  48: { label: "Nebbia gelata",           emoji: "🌫️", bg: "#ECEFF1" },
  51: { label: "Pioggerella leggera",     emoji: "🌦️", bg: "#BBDEFB" },
  53: { label: "Pioggerella moderata",    emoji: "🌦️", bg: "#BBDEFB" },
  55: { label: "Pioggerella intensa",     emoji: "🌧️", bg: "#90CAF9" },
  61: { label: "Pioggia leggera",         emoji: "🌧️", bg: "#90CAF9" },
  63: { label: "Pioggia moderata",        emoji: "🌧️", bg: "#64B5F6" },
  65: { label: "Pioggia intensa",         emoji: "🌧️", bg: "#42A5F5" },
  71: { label: "Neve leggera",            emoji: "🌨️", bg: "#E1F5FE" },
  73: { label: "Neve moderata",           emoji: "❄️",  bg: "#B3E5FC" },
  75: { label: "Neve intensa",            emoji: "❄️",  bg: "#81D4FA" },
  77: { label: "Granelli di neve",        emoji: "🌨️", bg: "#E1F5FE" },
  80: { label: "Rovesci leggeri",         emoji: "🌦️", bg: "#BBDEFB" },
  81: { label: "Rovesci moderati",        emoji: "🌧️", bg: "#90CAF9" },
  82: { label: "Rovesci violenti",        emoji: "⛈️",  bg: "#5C6BC0" },
  85: { label: "Rovesci di neve",         emoji: "🌨️", bg: "#E1F5FE" },
  86: { label: "Rovesci di neve forti",   emoji: "❄️",  bg: "#B3E5FC" },
  95: { label: "Temporale",               emoji: "⛈️",  bg: "#3949AB" },
  96: { label: "Temporale con grandine",  emoji: "⛈️",  bg: "#283593" },
  99: { label: "Temporale forte + grandine", emoji: "🌩️", bg: "#1A237E" },
};

/**
 * Restituisce le info meteo per un codice WMO dato.
 * Se il codice non è riconosciuto, restituisce un fallback generico.
 *
 * @param {number} code - Codice WMO
 * @returns {WeatherInfo}
 */
export function getWeatherInfo(code) {
  return WMO_CODES[code] ?? { label: "Condizione sconosciuta", emoji: "🌡️", bg: "#F5F5F5" };
}

/**
 * Converte la direzione del vento in gradi in un punto cardinale.
 * @param {number} degrees
 * @returns {string}
 */
export function windDirection(degrees) {
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return dirs[Math.round(degrees / 45) % 8];
}
