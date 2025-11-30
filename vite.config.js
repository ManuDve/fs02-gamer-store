import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "/fs02-gamer-store/",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://gamer-store-back.duckdns.org',
        changeOrigin: true
      }
    }
  }
});
