/**
 * useGeolocation.js
 * Custom hook per ottenere la posizione geografica dell'utente
 * tramite navigator.geolocation.getCurrentPosition().
 *
 * @module useGeolocation
 */

import { useState, useCallback } from "react";

/**
 * @typedef {Object} GeolocationCoords
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * @typedef {Object} GeolocationState
 * @property {GeolocationCoords|null} coords
 * @property {boolean} loading
 * @property {string|null} error
 * @property {() => void} requestLocation
 */

/**
 * Hook che wrappa navigator.geolocation.getCurrentPosition().
 * Gestisce stati di loading, errori (incluso permission denied) e coordinate.
 *
 * @returns {GeolocationState}
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    // Controlla se il browser supporta la geolocation
    if (!navigator.geolocation) {
      setError("Geolocalizzazione non supportata dal browser.");
      return;
    }

    setLoading(true);
    setError(null);
    setCoords(null);

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      // Error callback
      (err) => {
        let message;
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = "Permesso negato. Abilita la geolocalizzazione nelle impostazioni.";
            break;
          case err.POSITION_UNAVAILABLE:
            message = "Posizione non disponibile. Prova a cercare manualmente.";
            break;
          case err.TIMEOUT:
            message = "Timeout nella richiesta di posizione. Riprova.";
            break;
          default:
            message = "Errore nella geolocalizzazione. Riprova.";
        }
        setError(message);
        setLoading(false);
      },
      // Options
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000, // Cache di 1 minuto
      }
    );
  }, []);

  return { coords, loading, error, requestLocation };
}

export default useGeolocation;
