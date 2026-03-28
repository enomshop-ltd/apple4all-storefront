import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [fresh(), tailwindcss()],
  resolve: {
    alias: {
      // Intercept the npm: protocol imports from JSR packages 
      // and point them to the local node_modules resolving path
      "npm:preact@^10.27.2": "preact",
      "npm:preact@^10.27.2/hooks": "preact/hooks",
      "npm:@preact/signals@^2.5.0": "@preact/signals",
      "npm:@preact/signals@^2.2.1": "@preact/signals",
    },
  },
  build: {
    sourcemap: false, 
    rollupOptions: {
      external:[
        "npm:preact-render-to-string@^6.6.3",
        "preact-render-to-string"
      ],
      output: {
        entryFileNames: `[name].mjs`,
        chunkFileNames: `[name].mjs`,
        manualChunks: {
          "medusa-sdk": ["@medusajs/js-sdk"],
          "icons": ["lucide-preact"],
        },
      },
    },
  },
});