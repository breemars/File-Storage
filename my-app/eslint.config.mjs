import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

//Installed Packages
import tailwindcss from "eslint-plugin-tailwindcss";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Tailwind CSS
  {
    plugins: {
      tailwindcss,
    },
    settings: {
      tailwindcss: {
        stylesheet: "./app/globals.css",
      },
    },
  },

  // Disable ESLint rules that conflict with Prettier
  prettier,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
