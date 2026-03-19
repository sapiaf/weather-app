/**
 * WeatherDetails.jsx
 * Griglia con i dettagli aggiuntivi: percepita, umidità, vento, pioggia, UV.
 */

import { windDirection } from "../utils/weatherCodes";

/**
 * @param {{ data: import('../hooks/useWeather').WeatherResult }} props
 */
export default function WeatherDetails({ data }) {
  const items = [
    {
      icon: "🌡️",
      label: "Percepita",
      value: data.feelsLike != null ? `${Math.round(data.feelsLike)}°C` : "—",
    },
    {
      icon: "💧",
      label: "Umidità",
      value: data.humidity != null ? `${data.humidity}%` : "—",
    },
    {
      icon: "💨",
      label: "Vento",
      value: `${Math.round(data.windspeed)} km/h ${windDirection(data.winddirection)}`,
    },
    {
      icon: "🌂",
      label: "Prob. pioggia",
      value: data.precipProbability != null ? `${data.precipProbability}%` : "—",
    },
    {
      icon: "☀️",
      label: "Indice UV",
      value: data.uvIndex != null ? uvLabel(data.uvIndex) : "—",
    },
  ];

  return (
    <div className="weather-details">
      {items.map(({ icon, label, value }) => (
        <div className="detail-item" key={label}>
          <span className="detail-icon">{icon}</span>
          <span className="detail-label">{label}</span>
          <span className="detail-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Converte l'indice UV numerico in una stringa descrittiva.
 * @param {number} uv
 * @returns {string}
 */
function uvLabel(uv) {
  if (uv <= 2)  return `${uv} Basso`;
  if (uv <= 5)  return `${uv} Moderato`;
  if (uv <= 7)  return `${uv} Alto`;
  if (uv <= 10) return `${uv} Molto alto`;
  return `${uv} Estremo`;
}
