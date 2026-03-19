/**
 * WeatherDetails.jsx
 * Griglia con i dettagli aggiuntivi: percepita, umidità, vento, pioggia, UV.
 */

import { windDirection } from "../utils/weatherCodes";
import { convertTemp, convertSpeed, formatTemp, formatSpeed } from "../utils/units";

/**
 * @param {{ data: import('../hooks/useWeather').WeatherResult, units: { temperature: string, speed: string } }} props
 */
export default function WeatherDetails({ data, units }) {
  const tempUnit = units?.temperature ?? 'C';
  const speedUnit = units?.speed ?? 'kmh';

  const displayFeelsLike = data.feelsLike != null
    ? formatTemp(convertTemp(data.feelsLike, tempUnit), tempUnit)
    : "—";

  const displayWind = formatSpeed(convertSpeed(data.windspeed, speedUnit), speedUnit);

  const items = [
    {
      icon: "🌡️",
      label: "Percepita",
      value: displayFeelsLike,
    },
    {
      icon: "💧",
      label: "Umidità",
      value: data.humidity != null ? `${data.humidity}%` : "—",
    },
    {
      icon: "💨",
      label: "Vento",
      value: `${displayWind} ${windDirection(data.winddirection)}`,
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
