import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        QMGHP: resolve(__dirname, "QMGInfo/index.html"),
        LCEE: resolve(__dirname, "LCETools/index.html"), // temp so that existing links dont break
        LCETools: resolve(__dirname, "LCETools/index.html"),
        "403": resolve(__dirname, "403/index.html"),
        "404": resolve(__dirname, "404/index.html"),
      },
    }
  },
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
  }
});
