import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [fresh(), tailwindcss()],
  build: {
    sourcemap: false, // Disables sourcemaps for the whole build
    // OR specifically ignore the warnings:
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_ERROR') return;
        warn(warning);
      },
      output: {
        manualChunks: {
          'medusa-sdk': ['@medusajs/js-sdk'],
          'icons': ['lucide-react'],
        },
      },
    },
  },
});
