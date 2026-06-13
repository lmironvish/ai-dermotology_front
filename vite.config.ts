import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET;

  return {
    base: "/ai-dermotology_front/",

    plugins: [
      figmaAssetResolver(),
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: apiProxyTarget
      ? {
          proxy: {
            "/api/v1": {
              target: apiProxyTarget,
              changeOrigin: true,
            },
          },
        }
      : undefined,

    assetsInclude: ["**/*.svg", "**/*.csv"],
  };
});