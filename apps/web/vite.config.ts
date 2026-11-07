import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    proxy: {
      // Proxy agent requests to the local eve dev server
      "/eve/v1": {
        target: "http://127.0.0.1:2000",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({ srcDirectory: "app" }),
    viteReact(),
    nitro(),
  ],
});
