import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // Vitest usa jsdom per simulare il DOM nei test
    environment: "jsdom",
    globals:     true,
  },
});
