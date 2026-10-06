import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Default to node; web test files must carry // @vitest-environment jsdom at line 1
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    restoreMocks: true,
  },
});

