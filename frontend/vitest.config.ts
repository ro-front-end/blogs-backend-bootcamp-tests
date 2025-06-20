import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./testSetup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "vitest.setup.ts",
        "**/*.test.tsx",
        "**/*.test.jsx",
        "**/*.test.ts",
        "**/*.test.js",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
