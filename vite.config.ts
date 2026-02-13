import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/academy": {
        target: "https://next-gen-academy.genr83d.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/academy/, ""),
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
});
