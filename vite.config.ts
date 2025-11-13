import path from "path"
import react from "@vitejs/plugin-react"
import tailwind from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  root: "client",
  build: {
    outDir: "../dist-client",
    emptyOutDir: true,
  },
})
