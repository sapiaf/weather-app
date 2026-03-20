/**
 * useGeolocation.js
 * Custom hook per ottenere la posizione geografica dell'utente
 * tramite navigator.geolocation.getCurrentPosition().
 *
 * @module useGeolocation
 */

import { useState, useCallback, useRef } from "react";

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
 * Previene richieste parallele tramite un ref di guard.
 *
 * @returns {GeolocationState}
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guard: evita che doppi click lancino richieste GPS parallele
  const isRequestingRef = useRef(false);

  const requestLocation = useCallback(() => {
    // Controlla se il browser supporta la geolocation
    if (!navigator.geolocation) {
      setError("Geolocalizzazione non supportata dal browser.");
      return;
    }

    // Guard: se c'è già una richiesta in corso, non avviarne un'altra
    if (isRequestingRef.current) return;

    isRequestingRef.current = true;
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
        isRequestingRef.current = false;
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
        isRequestingRef.current = false;
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
