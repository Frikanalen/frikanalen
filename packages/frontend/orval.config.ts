import { defineConfig } from "orval";

export default defineConfig({
  django: {
    input: "./django-api.yaml",
    output: {
      target: "./src/generated/django-api.ts",
      baseUrl: "http://localhost:8000",
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
