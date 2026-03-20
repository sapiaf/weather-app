/**
 * weather.test.js
 * Test suite con Vitest.
 *
 * Esegui con: npm run test
 *
 * TEST 1: getWeatherInfo — verifica mappatura codici WMO
 * TEST 2: getWeatherByCity — verifica la logica fetch con mock
 * TEST 3: getCached / setCache — verifica TTL della cache (edge case)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getWeatherInfo, windDirection }  from "../utils/weatherCodes";
import { geocodeCity, fetchWeather, reverseGeocode, getWeatherByCoords } from "../services/weatherApi";

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1 — weatherCodes: getWeatherInfo
// ─────────────────────────────────────────────────────────────────────────────
describe("getWeatherInfo", () => {
  it("restituisce le info corrette per il codice 0 (cielo sereno)", () => {
    const info = getWeatherInfo(0);
    expect(info.label).toBe("Cielo sereno");
    expect(info.emoji).toBe("☀️");
  });

  it("restituisce le info corrette per il codice 95 (temporale)", () => {
    const info = getWeatherInfo(95);
    expect(info.label).toBe("Temporale");
    expect(info.emoji).toBe("⛈️");
  });

  it("restituisce il fallback per un codice sconosciuto", () => {
    const info = getWeatherInfo(9999);
    expect(info.label).toBe("Condizione sconosciuta");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2 — windDirection
// ─────────────────────────────────────────────────────────────────────────────
describe("windDirection", () => {
  it("0° → Nord", ()  => expect(windDirection(0)).toBe("N"));
  it("90° → Est", ()  => expect(windDirection(90)).toBe("E"));
  it("180° → Sud", () => expect(windDirection(180)).toBe("S"));
  it("270° → Ovest",()=> expect(windDirection(270)).toBe("O"));
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3 — geocodeCity: validazione input + mock fetch
// ─────────────────────────────────────────────────────────────────────────────
describe("geocodeCity", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lancia un errore se la città è una stringa vuota", async () => {
    await expect(geocodeCity("   ")).rejects.toThrow(
      "Il nome della città non può essere vuoto."
    );
  });

  it("lancia un errore se la città non è trovata (results vuoto)", async () => {
    fetch.mockResolvedValueOnce({
      ok:   true,
      json: async () => ({ results: [] }),
    });
    await expect(geocodeCity("XyzNonEsiste")).rejects.toThrow(
      'Città "XyzNonEsiste" non trovata'
    );
  });

  it("restituisce lat/lon corretti per una risposta valida", async () => {
    fetch.mockResolvedValueOnce({
      ok:   true,
      json: async () => ({
        results: [{ name: "Milano", country: "Italy", latitude: 45.46, longitude: 9.19 }],
      }),
    });
    const result = await geocodeCity("Milano");
    expect(result.name).toBe("Milano");
    expect(result.lat).toBe(45.46);
    expect(result.lon).toBe(9.19);
  });

  it("lancia un errore HTTP quando la risposta non è ok", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(geocodeCity("Roma")).rejects.toThrow("Errore geocoding (HTTP 500)");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4 — fetchWeather: mock + validazione risposta
// ─────────────────────────────────────────────────────────────────────────────
describe("fetchWeather", () => {
  beforeEach(() => { vi.stubGlobal("fetch", vi.fn()); });
  afterEach(()  => { vi.restoreAllMocks(); });

  it("restituisce current_weather per una risposta valida", async () => {
    fetch.mockResolvedValueOnce({
      ok:   true,
      json: async () => ({
        current_weather: { temperature: 22, weathercode: 1, windspeed: 10, winddirection: 180 },
        hourly: {},
      }),
    });
    const data = await fetchWeather(45.46, 9.19);
    expect(data.current_weather.temperature).toBe(22);
  });

  it("lancia un errore se current_weather è assente", async () => {
    fetch.mockResolvedValueOnce({
      ok:   true,
      json: async () => ({}), // risposta senza current_weather
    });
    await expect(fetchWeather(45, 9)).rejects.toThrow("Risposta API non valida");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5 — reverseGeocode: Nominatim mock
// ─────────────────────────────────────────────────────────────────────────────
describe("reverseGeocode", () => {
  beforeEach(() => { vi.stubGlobal("fetch", vi.fn()); });
  afterEach(()  => { vi.restoreAllMocks(); });

  it("restituisce nome città da risposta Nominatim valida (town)", async () => {
    fetch.mockResolvedValueOnce({
      ok:   true,
      json: async () => ({
        address: { town: "Rho", country: "Italia" },
      }),
    });
    const result = await reverseGeocode(45.53, 9.04);
    expect(result.name).toBe("Rho");
    expect(result.country).toBe("Italia");
  });

  it("usa city se presente, prima di town", async () => {
    fetch.mockResolvedValueOnce({
      ok:   true,
      json: async () => ({
        address: { city: "Milano", town: "Rho", country: "Italia" },
      }),
    });
    const result = await reverseGeocode(45.46, 9.19);
    expect(result.name).toBe("Milano");
  });

  it("fallback a 'Posizione attuale' se nessun campo nome è presente", async () => {
    fetch.mockResolvedValueOnce({
      ok:   true,
      json: async () => ({
        address: { country: "Italia" },
      }),
    });
    const result = await reverseGeocode(45.0, 9.0);
    expect(result.name).toBe("Posizione attuale");
  });

  it("lancia un errore se address è assente", async () => {
    fetch.mockResolvedValueOnce({
      ok:   true,
      json: async () => ({}),
    });
    await expect(reverseGeocode(45.0, 9.0)).rejects.toThrow(
      "Posizione non trovata"
    );
  });

  it("lancia un errore HTTP quando la risposta non è ok", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(reverseGeocode(45.0, 9.0)).rejects.toThrow(
      "Errore reverse geocoding (HTTP 404)"
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6 — getWeatherByCoords: integrazione mock
// ─────────────────────────────────────────────────────────────────────────────
describe("getWeatherByCoords", () => {
  beforeEach(() => { vi.stubGlobal("fetch", vi.fn()); });
  afterEach(()  => { vi.restoreAllMocks(); });

  it("restituisce un oggetto meteo normalizzato con città da Nominatim", async () => {
    const nowIso = new Date().toISOString().slice(0, 13);

    // Prima chiamata: fetchWeather (Open-Meteo)
    fetch.mockResolvedValueOnce({
      ok:   true,
      json: async () => ({
        current_weather: {
          temperature: 18,
          weathercode: 2,
          windspeed: 12,
          winddirection: 270,
        },
        hourly: {
          time:                     [`${nowIso}:00`],
          apparent_temperature:     [16],
          relativehumidity_2m:      [65],
          precipitation_probability:[20],
          windspeed_10m:            [12],
          winddirection_10m:        [270],
          uv_index:                 [3],
        },
      }),
    });

    // Seconda chiamata: reverseGeocode (Nominatim)
    fetch.mockResolvedValueOnce({
      ok:   true,
      json: async () => ({
        address: { city: "Milano", country: "Italia" },
      }),
    });

    const result = await getWeatherByCoords(45.46, 9.19);

    expect(result.city).toBe("Milano");
    expect(result.country).toBe("Italia");
    expect(result.temperature).toBe(18);
    expect(result.lat).toBe(45.46);
    expect(result.lon).toBe(9.19);
    expect(result.humidity).toBe(65);
  });
});
