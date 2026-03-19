/**
 * DailyForecast.jsx
 * Componente per la visualizzazione delle previsioni giornaliere.
 *
 * @module DailyForecast
 */

import { getWeatherInfo } from "../utils/weatherCodes";
import { convertTemp, formatTemp } from "../utils/units";

/**
 * @param {Object} props
 * @param {Array} props.daily - Array di dati giornalieri
 * @param {{ temperature: string }} props.units - Unità di misura
 */
export default function DailyForecast({ daily, units }) {
  if (!daily || daily.length === 0) return null;

  const formatDay = (timeStr) => {
    const date = new Date(timeStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) return "Oggi";

    return date.toLocaleDateString("it-IT", {
      weekday: "short",
      day: "numeric",
    });
  };

  return (
    <div className="forecast-section">
      <h3 className="forecast-title">Prossimi 7 giorni</h3>
      <div className="daily-list">
        {daily.map((day, idx) => {
          const info = getWeatherInfo(day.code);
          const max = convertTemp(day.max, units.temperature);
          const min = convertTemp(day.min, units.temperature);

          return (
            <div key={idx} className="daily-item">
              <span className="daily-day">{formatDay(day.time)}</span>
              <span className="daily-icon" role="img" aria-label={info.label}>
                {info.emoji}
              </span>
              <div className="daily-temps">
                <span className="daily-max">{formatTemp(max, units.temperature)}</span>
                <span className="daily-min">{formatTemp(min, units.temperature)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
