import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([...nextVitals, globalIgnores([".codex-tmp/**", ".next/**", ".tmp/**", "node_modules/**"])]);
