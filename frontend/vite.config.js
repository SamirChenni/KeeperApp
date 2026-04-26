import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { 
      "/register": "http://localhost:3000",
      "/login": "http://localhost:3000" ,
      "/auth": "http://localhost:3000",
      "/logout": "http://localhost:3000", 
      "/api/notes": "http://localhost:3000"
    },
  },
});
