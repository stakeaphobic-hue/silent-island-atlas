import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// @ts-expect-error JS plugin
import { appEnvPlugin } from "./scripts/app-env-plugin.mjs";

/** Static SPA for GitHub Pages. Live preview still uses vite.config.ts. */
export default defineConfig({
  base: "/silent-island-atlas/",
  resolve: { tsconfigPaths: true },
  plugins: [
    appEnvPlugin(),
    tailwindcss(),
    tanstackStart({ spa: { enabled: true } }),
    viteReact(),
  ],
});
