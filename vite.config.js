import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react()],
  server: {
    host: "127.0.0.1",
    port: 5174,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4174,
    strictPort: true,
  },
});
