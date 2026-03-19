# 🌍 Weather App

App meteo in tempo reale costruita con **React + Vite** e **Open-Meteo API**.

---

## ✨ Funzionalità

| Funzionalità | Dettaglio |
|---|---|
| 🌐 Chiamata API | Geocoding + Forecast via Open-Meteo (no API key) |
| ⚠️ Gestione errori | Messaggi chiari per città non trovata, errori HTTP, rete assente |
| ⚡ Caching | `localStorage` con TTL 10 minuti — evita chiamate ridondanti |
| 🏙️ Storico città | Ultime 5 ricerche cliccabili |
| 🧪 Test | 4+ test unitari con Vitest (mock fetch, edge case) |
| 📖 Documentazione | JSDoc su tutti i moduli, README completo |
| 🔒 Sicurezza | CSP header, sanitizzazione input, nessuna API key, `.env` in `.gitignore` |

---

## 🚀 Avvio rapido

```bash
# 1. Installa le dipendenze
npm install

# 2. Avvia in modalità sviluppo
npm run dev
# → http://localhost:5173

# 3. Build di produzione
npm run build
```

---

## 🧪 Test

```bash
# Esegui tutti i test (una volta)
npm run test

# Modalità watch (riesegue ad ogni modifica)
npm run test:watch
```

I test si trovano in `src/__tests__/weather.test.js` e coprono:
- Mappatura codici WMO (`getWeatherInfo`, `windDirection`)
- Logica geocoding con mock fetch (città vuota, non trovata, risposta valida, errore HTTP)
- Validazione risposta forecast (`fetchWeather`)

---

## 🗂️ Struttura progetto

```
src/
├── components/
│   ├── SearchBar.jsx       Input + bottone cerca
│   ├── WeatherCard.jsx     Card principale (temp, emoji, città)
│   ├── WeatherDetails.jsx  Umidità, vento, UV, percepita
│   ├── ErrorMessage.jsx    Gestione visuale errori
│   └── CityHistory.jsx     Ultime 5 città cercate
├── hooks/
│   └── useWeather.js       Custom hook: stato + caching localStorage
├── services/
│   └── weatherApi.js       Fetch geocoding + forecast
├── utils/
│   └── weatherCodes.js     Mappa WMO codes → label + emoji
└── __tests__/
    └── weather.test.js     Suite di test Vitest
```

---

## 🔒 Sicurezza & Etica

- **Nessuna API key**: Open-Meteo è completamente gratuita e pubblica → nessun segreto da gestire.
- **Input sanitizzato**: tutti gli input utente sono processati con `encodeURIComponent` prima di essere inseriti nelle URL.
- **Content Security Policy**: l'`index.html` include un header CSP che limita le connessioni ai soli domini autorizzati.
- **Privacy**: nessun dato personale viene raccolto o trasmesso.
- **Licenza API**: Open-Meteo richiede attribuzione (CC BY 4.0) — presente nel footer dell'app.
- **AI responsabile**: questo progetto è stato sviluppato con assistenza AI (Claude). Il codice generato è stato revisionato e compreso prima dell'uso, seguendo le linee guida sull'uso responsabile di strumenti AI.

---

## 📦 Dipendenze principali

| Pacchetto | Ruolo |
|---|---|
| `react` + `react-dom` | UI framework |
| `vite` | Dev server + bundler |
| `vitest` | Test runner |
| `jsdom` | Ambiente DOM per i test |

---

## 🌐 Crediti API

Dati meteo forniti da [Open-Meteo](https://open-meteo.com) · Licenza [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
