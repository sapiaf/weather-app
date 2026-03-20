import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy solo per sviluppo locale — in produzione Nominatim viene chiamato direttamente
    proxy: {
      '/geo': {
        target: 'https://geocoding-api.open-meteo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geo/, ''),
      },
      // Proxy /nominatim rimosso: in produzione la chiamata è diretta a
      // https://nominatim.openstreetmap.org (vedi weatherApi.js)
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
