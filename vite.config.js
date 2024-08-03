import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
//http://localhost:8080/
//https://bazafarm-backend-v2-rlnd.onrender.com/
//http://172.104.56.161:8080/api-docs/
