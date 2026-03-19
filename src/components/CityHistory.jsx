/**
 * CityHistory.jsx
 * Feature avanzata: mostra le ultime città cercate come chip cliccabili.
 * Permette di rieseguire velocemente una ricerca precedente.
 */

/**
 * @param {{ history: string[], onSelect: (city: string) => void }} props
 */
export default function CityHistory({ history, onSelect }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="city-history">
      <span className="history-label">Recenti:</span>
      <div className="history-chips">
        {history.map((city) => (
          <button
            key={city}
            className="history-chip"
            onClick={() => onSelect(city)}
            aria-label={`Cerca di nuovo ${city}`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
