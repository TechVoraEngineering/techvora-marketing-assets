import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: "/techvora-marketing-assets/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        legacycostcalculator: resolve(__dirname, "legacycostcalculator.html"),
      },
    },
  },
});
