import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "work/**",
      "outputs/**",
      "lib/folio-runtime/**",
      "public/folio/**",
      "scripts/**",
    ],
  },
]);
