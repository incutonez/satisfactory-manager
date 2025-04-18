import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import svgLoader from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgLoader(), tailwindcss()],
  resolve: {
    alias: [{
      // Add ability to use @ to represent the root dir being src
      find: "@",
      replacement: path.resolve(path.resolve(), "./src"),
    }],
  },
})
