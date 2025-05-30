import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import jsonc from "eslint-plugin-jsonc";
import pluginPrettier from "eslint-plugin-prettier";
import prettierConfig from ".prettierrc.js";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js, prettier: pluginPrettier },
        extends: [
            "js/recommended",
            "plugin:react/recommended",
            "plugin:@typescript-eslint/recommended",
            "prettier", // Disables eslint rules conflicting with prettier
        ],
        rules: {
            "prettier/prettier": ["error", prettierConfig], // Runs prettier as eslint rule
        },
        languageOptions: { globals: globals.browser },
    },

    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,

    {
        files: ["**/*.{json,jsonc}"],
        plugins: { jsonc },
        languageOptions: {
            parser: jsonc.parsers.jsonc,
        },
        rules: {
            "jsonc/no-comments": "off",
            "jsonc/array-bracket-spacing": ["error", "never"],
            "jsonc/object-curly-spacing": ["error", "always"],
        },
    },
]);
