import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["dist", "node_modules/*", "build/", "build/*"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			pluginReact.configs.flat.recommended,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "off",
		},
		settings: {
			react: {
				version: "detect",
				runtime: "automatic",
			},
		},
	},
]);
