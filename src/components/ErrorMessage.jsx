/**
 * ErrorMessage.jsx
 * Mostra un messaggio di errore con un'icona.
 */

/**
 * @param {{ message: string }} props
 */
export default function ErrorMessage({ message }) {
  return (
    <div className="error-message" role="alert" aria-live="polite">
      <span className="error-icon">⚠️</span>
      <span>{message}</span>
    </div>
  );
}
