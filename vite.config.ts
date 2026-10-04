import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// Tauri 要求固定开发端口，生产构建产物落在 dist/。
export default defineConfig({
  plugins: [vue()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: { ignored: ["**/src-tauri/**"] },
  },
  envPrefix: ["VITE_", "TAURI_ENV_"],
});
