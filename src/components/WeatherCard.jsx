/**
 * WeatherCard.jsx
 * Card principale che mostra temperatura, condizione e città.
 */

import { getWeatherInfo } from "../utils/weatherCodes";
import { convertTemp, formatTemp } from "../utils/units";

/**
 * @param {{ data: import('../hooks/useWeather').WeatherResult, fromCache: boolean, units: { temperature: string } }} props
 */
export default function WeatherCard({ data, fromCache, units }) {
  const info = getWeatherInfo(data.weathercode);
  const displayTemp = formatTemp(convertTemp(data.temperature, units?.temperature ?? 'C'), units?.temperature ?? 'C');

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
        <span className="temperature">{displayTemp}</span>
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
