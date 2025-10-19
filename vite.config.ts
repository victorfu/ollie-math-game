import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ollie-math-game/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
  },
});
