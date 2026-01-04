import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/main.tsx",
      name: "RemindersApp",
      fileName: () => "reminders-app.js",
      formats: ["iife"]
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: () => "react-reminders.css"
      }
    }
  }
});
