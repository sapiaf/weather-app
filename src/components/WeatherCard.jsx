/**
 * WeatherCard.jsx
 * Card principale che mostra temperatura, condizione e città.
 */

import { getWeatherInfo } from "../utils/weatherCodes";

/**
 * @param {{ data: import('../hooks/useWeather').WeatherResult, fromCache: boolean }} props
 */
export default function WeatherCard({ data, fromCache }) {
  const info = getWeatherInfo(data.weathercode);

  return (
    <div className="weather-card" style={{ "--card-bg": info.bg }}>
      <div className="weather-card__location">
        <span className="city">{data.city}</span>
        <span className="country">{data.country}</span>
      </div>

      <div className="weather-card__main">
        <span className="emoji" role="img" aria-label={info.label}>
          {info.emoji}
        </span>
        <span className="temperature">{Math.round(data.temperature)}°</span>
      </div>

      <div className="weather-card__label">{info.label}</div>

      {fromCache && (
        <div className="cache-badge" title="Dati dalla cache locale (< 10 min)">
          ⚡ Cache
        </div>
      )}
    </div>
  );
}
