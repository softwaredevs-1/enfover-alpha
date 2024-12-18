import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000, // Frontend port
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend API server
        changeOrigin: true,
        secure: false, // Disable SSL verification for development
        ws: true, // Enable WebSocket support
      
      },
    },
  },
});
