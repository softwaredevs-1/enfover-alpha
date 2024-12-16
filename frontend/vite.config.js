import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000, // Set frontend development server to run on the same port as the backend
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Proxy API requests to the backend server
        changeOrigin: true,
      },
    },
  },
});