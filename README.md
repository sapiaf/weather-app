# 🌍 Weather App

App meteo in tempo reale costruita con **React + Vite** e **Open-Meteo API**.

---

## ✨ Funzionalità

| Funzionalità | Dettaglio |
|---|---|
| 🌐 Chiamata API | Geocoding + Forecast via Open-Meteo (no API key) |
| 📍 Geolocalizzazione | Rilevamento posizione GPS con reverse geocoding via Nominatim (OpenStreetMap) |
| ⚠️ Gestione errori | Messaggi chiari per città non trovata, errori HTTP, rete assente |
| ⚡ Caching | `localStorage` con TTL 10 minuti — evita chiamate ridondanti |
| 🏙️ Storico città | Ultime 5 ricerche cliccabili (escluse posizioni GPS) |
| 🌡️ Unità configurabili | Toggle °C/°F e km/h/mph con persistenza in localStorage |
| 🌓 Tema chiaro/scuro | Rilevamento preferenza sistema + persistenza manuale |
| 📅 Previsioni | Orario (prossime 24h) e giornaliero (7 giorni) |
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
│   ├── SearchBar.jsx       Input + bottone cerca + bottone geolocalizzazione
│   ├── WeatherCard.jsx     Card principale (temp, emoji, città)
│   ├── WeatherDetails.jsx  Umidità, vento, UV, percepita
│   ├── ErrorMessage.jsx    Gestione visuale errori
│   ├── CityHistory.jsx     Ultime 5 città cercate
│   ├── HourlyForecast.jsx  Previsioni orarie (prossime 24h)
│   └── DailyForecast.jsx   Previsioni giornaliere (7 giorni)
├── hooks/
│   ├── useWeather.js       Custom hook: stato + caching localStorage
│   ├── useGeolocation.js   Custom hook: navigator.geolocation wrapper
│   ├── useForecast.js      Custom hook: previsioni orarie e giornaliere
│   ├── useUnits.js         Custom hook: gestione °C/°F e km/h/mph
│   └── useTheme.js         Custom hook: tema chiaro/scuro
├── services/
│   └── weatherApi.js       Fetch geocoding, forecast, reverse geocoding
├── utils/
│   ├── weatherCodes.js     Mappa WMO codes → label + emoji
│   └── units.js            Conversioni unità di misura
└── __tests__/
    └── weather.test.js     Suite di test Vitest
```

---

## 📍 Geolocalizzazione

Il bottone GPS nella barra di ricerca rileva la posizione dell'utente tramite `navigator.geolocation` e mostra il meteo senza necessità di digitare nulla.

Il flusso è:
1. Il browser ottiene le coordinate GPS reali
2. Le coordinate vengono usate **direttamente** per il fetch meteo (senza passare per il geocoding, evitando ambiguità su omonimi geografici)
3. Il nome della città viene risolto tramite **reverse geocoding Nominatim** (OpenStreetMap), instradato via proxy Vite su `/nominatim`

> **Nota**: le posizioni rilevate via GPS non vengono aggiunte allo storico delle ricerche.

---

## 🔒 Sicurezza & Etica

- **Nessuna API key**: Open-Meteo e Nominatim sono completamente gratuite e pubbliche → nessun segreto da gestire.
- **Input sanitizzato**: tutti gli input utente sono processati con `encodeURIComponent` prima di essere inseriti nelle URL.
- **Content Security Policy**: l'`index.html` include un header CSP che limita le connessioni ai soli domini autorizzati (`open-meteo.com`, `nominatim.openstreetmap.org`, `fonts.googleapis.com`).
- **Privacy**: nessun dato personale viene raccolto o trasmesso.
- **Licenza API**: Open-Meteo richiede attribuzione (CC BY 4.0) — presente nel footer dell'app. Nominatim richiede un User-Agent identificativo nelle richieste.
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

- Dati meteo forniti da [Open-Meteo](https://open-meteo.com) · Licenza [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Reverse geocoding fornito da [Nominatim / OpenStreetMap](https://nominatim.org) · Licenza [ODbL](https://www.openstreetmap.org/copyright)