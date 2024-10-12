import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    host: '::',
    port: 80,
    strictPort: true
  },
  preview: {
    open: true,
    host: '::',
    port: 80,
    strictPort: true
  },
  plugins: [react()]
});
