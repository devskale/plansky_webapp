// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/exampleplans": {
        target: "http://pind.mooo.com:8000",
        changeOrigin: true,
      },
    },
  },
});
