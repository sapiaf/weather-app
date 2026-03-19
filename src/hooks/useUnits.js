/**
 * useUnits.js
 * Hook per la gestione delle unità di misura con persistenza in localStorage.
 */

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'weather_units';

const DEFAULT_UNITS = {
  temperature: 'C',
  speed: 'kmh',
};

/**
 * Legge le unità salvate dal localStorage.
 * @returns {{ temperature: string, speed: string }}
 */
function loadUnits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        temperature: parsed.temperature ?? DEFAULT_UNITS.temperature,
        speed: parsed.speed ?? DEFAULT_UNITS.speed,
      };
    }
  } catch {
    // Ignora errori di parsing o localStorage non disponibile
  }
  return { ...DEFAULT_UNITS };
}

/**
 * Salva le unità nel localStorage.
 * @param {{ temperature: string, speed: string }} units
 */
function saveUnits(units) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(units));
  } catch {
    // Ignora errori di quota localStorage
  }
}

/**
 * @returns {{
 *   units: { temperature: string, speed: string },
 *   toggleTempUnit: () => void,
 *   toggleSpeedUnit: () => void,
 *   setUnits: (units: { temperature?: string, speed?: string }) => void,
 * }}
 */
export function useUnits() {
  const [units, setUnitsState] = useState(loadUnits);

  // Salva nel localStorage quando cambiano
  useEffect(() => {
    saveUnits(units);
  }, [units]);

  const toggleTempUnit = useCallback(() => {
    setUnitsState((prev) => ({
      ...prev,
      temperature: prev.temperature === 'C' ? 'F' : 'C',
    }));
  }, []);

  const toggleSpeedUnit = useCallback(() => {
    setUnitsState((prev) => ({
      ...prev,
      speed: prev.speed === 'kmh' ? 'mph' : 'kmh',
    }));
  }, []);

  const setUnits = useCallback((newUnits) => {
    setUnitsState((prev) => ({
      ...prev,
      ...newUnits,
    }));
  }, []);

  return { units, toggleTempUnit, toggleSpeedUnit, setUnits };
}
