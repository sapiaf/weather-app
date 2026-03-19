/**
 * HourlyForecast.jsx
 * Componente per la visualizzazione delle previsioni orarie.
 *
 * @module HourlyForecast
 */

import { getWeatherInfo } from "../utils/weatherCodes";
import { convertTemp, formatTemp } from "../utils/units";

/**
 * @param {Object} props
 * @param {Array} props.hourly - Array di dati orari
 * @param {{ temperature: string }} props.units - Unità di misura
 */
export default function HourlyForecast({ hourly, units }) {
  if (!hourly || hourly.length === 0) return null;

  const formatHour = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="forecast-section">
      <h3 className="forecast-title">Prossime 24 ore</h3>
      <div className="hourly-scroll">
        {hourly.map((hour, idx) => {
          const info = getWeatherInfo(hour.code);
          const temp = convertTemp(hour.temp, units.temperature);

          return (
            <div key={idx} className="hourly-item">
              <span className="hourly-time">{formatHour(hour.time)}</span>
              <span className="hourly-icon" role="img" aria-label={info.label}>
                {info.emoji}
              </span>
              <span className="hourly-temp">{formatTemp(temp, units.temperature)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
