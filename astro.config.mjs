import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Static output — το Vercel ανιχνεύει αυτόματα Astro, δεν χρειάζεται adapter.
// Το SITE_URL το χρησιμοποιούμε για canonical / Open Graph absolute URLs.
export default defineConfig({
  site: process.env.SITE_URL || "https://oksyderkeis.vercel.app",
  vite: {
    plugins: [tailwindcss()],
  },
});
