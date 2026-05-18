import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Only load lovable-tagger in development + when available (Lovable environment)
  const plugins: any[] = [react()];
  
  if (mode === "development") {
    try {
      // Dynamic require only in dev mode — safe to fail outside Lovable
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { componentTagger } = require("lovable-tagger");
      plugins.push(componentTagger());
    } catch {
      // Not in Lovable environment — skip tagger
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    preview: {
      host: "::",
      port: 4173,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            supabase: ["@supabase/supabase-js"],
            charts: ["recharts"],
          },
        },
      },
    },
  };
});
