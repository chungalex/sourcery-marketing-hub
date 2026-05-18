import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// componentTagger only works in Lovable environment — safe to skip outside
let componentTagger: any = null;
try {
  componentTagger = require("lovable-tagger").componentTagger;
} catch (e) {
  // Not in Lovable environment, skip
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger && componentTagger()
  ].filter(Boolean),
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
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-select"],
          supabase: ["@supabase/supabase-js"],
          charts: ["recharts"],
        },
      },
    },
  },
}));
