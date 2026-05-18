import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [fresh(), tailwindcss()],
  resolve: {
    alias: {
      "npm:preact@^10.29.1": "preact",
      "npm:preact@^10.29.1/hooks": "preact/hooks",
      "npm:preact@^10.27.2": "preact",
      "npm:preact@^10.27.2/hooks": "preact/hooks",
      "npm:@preact/signals@^2.9.0": "@preact/signals",
      "npm:@preact/signals@^2.5.0": "@preact/signals",
      "npm:@preact/signals@^2.2.1": "@preact/signals",
      "npm:preact-render-to-string@^6.6.3": "preact-render-to-string",
      "npm:/preact@^10.29.1": "preact",
      "npm:/preact@^10.29.1/hooks": "preact/hooks",
      "npm:/preact@^10.27.2": "preact",
      "npm:/preact@^10.27.2/hooks": "preact/hooks",
      "npm:/@preact/signals@^2.9.0": "@preact/signals",
      "npm:/@preact/signals@^2.5.0": "@preact/signals",
      "npm:/@preact/signals@^2.2.1": "@preact/signals",
      "npm:/preact-render-to-string@^6.6.3": "preact-render-to-string",
    },
  },
  // We completely remove the `build.rollupOptions` block
  // so Fresh can handle the chunking and CSS injection naturally.
});
