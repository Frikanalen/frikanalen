import { defineConfig } from "orval";

export default defineConfig({
  django: {
    input: "./django-api.yaml",
    output: {
      target: "./src/generated",
      client: "react-query",
      mode: "tags-split",
      mock: true,
      override: {
        mutator: {
          path: "./src/api/mutator/customAxios.ts",
          name: "customAxios",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
