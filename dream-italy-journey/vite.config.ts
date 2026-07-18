import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const DEFAULT_WHATSAPP_WIDGET_ORIGIN = "https://whatsapp.clustal.co";

const normalizeWidgetOrigin = (origin: string) => {
  const trimmedOrigin = origin.trim().replace(/\/+$/, "");

  if (!trimmedOrigin) {
    return DEFAULT_WHATSAPP_WIDGET_ORIGIN;
  }

  if (/^https?:\/\//i.test(trimmedOrigin)) {
    return trimmedOrigin;
  }

  return `http://${trimmedOrigin}`;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const whatsappWidgetOrigin = normalizeWidgetOrigin(env.VITE_WHATSAPP_WIDGET_ORIGIN || DEFAULT_WHATSAPP_WIDGET_ORIGIN);

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      {
        name: "inject-whatsapp-widget-origin",
        transformIndexHtml() {
          return [
            {
              tag: "script",
              attrs: {
                src: `${whatsappWidgetOrigin}/widget.js`,
                "data-clustal-widget-token": "cw_6ff6a38d7e5419b64a41d0522db0388097530a7837d4655c",
                async: true,
              },
              injectTo: "body",
            },
          ];
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
