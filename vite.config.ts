import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows the server to be accessed externally
    allowedHosts: ["code.mathiy.com"], // Add the allowed host here
  },
});
