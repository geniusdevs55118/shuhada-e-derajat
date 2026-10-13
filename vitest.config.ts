import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["tests/setup.ts", "tests/teardown.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: ["tests/e2e/**"],
    hookTimeout: 180000,
    testTimeout: 120000,
    teardownTimeout: 10000,
    fileParallelism: false,
  },
});
