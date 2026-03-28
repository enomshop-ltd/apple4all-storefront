import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins:[fresh(), tailwindcss()],
  resolve: {
    alias: {
      // Intercept the npm: protocol imports from JSR packages 
      // and point them to the local node_modules resolving path
      "npm:preact@^10.27.2": "preact",
      "npm:preact@^10.27.2/hooks": "preact/hooks",
      "npm:@preact/signals@^2.5.0": "@preact/signals",
      "npm:@preact/signals@^2.2.1": "@preact/signals",
      // FIX: Alias the render-to-string module so Vite bundles it correctly
      // instead of leaking the npm: URL to the browser!
      "npm:preact-render-to-string@^6.6.3": "preact-render-to-string",
    },
  },
  // We completely remove the `build.rollupOptions` block 
  // so Fresh can handle the chunking and CSS injection naturally.
});