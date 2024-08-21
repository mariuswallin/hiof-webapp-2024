import baseConfig from "../eslint.config";
const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.node.json");

export default {
  ...baseConfig,
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    ...baseConfig.extends,
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "eslint.config.js"],
  parser: "@typescript-eslint/parser",
  rules: {
    ...baseConfig.rules,
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
};
