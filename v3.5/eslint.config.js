export default {
  root: true,
  extends: ["@antfu"],
  rules: {
    semi: ["error", "always"],
    "@typescript-eslint/semi": ["error", "always"],
    indent: "off",
    "@typescript-eslint/indent": [
      "error",
      2,
      {
        ignoredNodes: [
          "FunctionExpression > .params[decorators.length > 0]",
          "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
          "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key",
        ],
      },
    ],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "brace-style": "off",
    "@typescript-eslint/brace-style": [
      "error",
      "1tbs",
      {
        allowSingleLine: true,
      },
    ],
  },
};
