/**
 * units.js
 * Utility per la conversione e formattazione delle unità di misura.
 */

/**
 * Converte la temperatura da Celsius a Fahrenheit o viceversa.
 * @param {number} celsius - Temperatura in gradi Celsius
 * @param {string} toUnit - Unità target ('C' o 'F')
 * @returns {number} Temperatura convertita
 */
export function convertTemp(celsius, toUnit) {
  if (toUnit === 'F') {
    return (celsius * 9) / 5 + 32;
  }
  return celsius;
}

/**
 * Converte la velocità da km/h a mph o viceversa.
 * @param {number} kmh - Velocità in km/h
 * @param {string} toUnit - Unità target ('kmh' o 'mph')
 * @returns {number} Velocità convertita
 */
export function convertSpeed(kmh, toUnit) {
  if (toUnit === 'mph') {
    return kmh * 0.621371;
  }
  return kmh;
}

/**
 * Formatta la temperatura con il simbolo dell'unità.
 * @param {number} value - Valore temperatura
 * @param {string} unit - Unità ('C' o 'F')
 * @returns {string} Temperatura formattata (es: "25°C" o "77°F")
 */
export function formatTemp(value, unit) {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded}°${unit}`;
}

/**
 * Formatta la velocità con l'unità di misura.
 * @param {number} value - Valore velocità
 * @param {string} unit - Unità ('kmh' o 'mph')
 * @returns {string} Velocità formattata (es: "15 km/h" o "9.3 mph")
 */
export function formatSpeed(value, unit) {
  const rounded = Math.round(value * 10) / 10;
  const unitLabel = unit === 'mph' ? 'mph' : 'km/h';
  return `${rounded} ${unitLabel}`;
}
