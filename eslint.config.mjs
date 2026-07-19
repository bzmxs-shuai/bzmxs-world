import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "work/**",
      "outputs/**",
      "lib/folio-runtime/**",
      "public/folio/**",
      "public/folio-2025/**",
      "scripts/**",
    ],
  },
  ...nextVitals,
  ...nextTypescript,
]);
