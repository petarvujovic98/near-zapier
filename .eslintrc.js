/* eslint-env node */

module.exports = {
  overrides: [
    {
      files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
      plugins: ["node"],
      extends: ["eslint:recommended", "plugin:import/recommended", "prettier"],
      rules: {
        "no-console": [
          "error",
          {
            allow: ["warn", "error"],
          },
        ],
        "node/no-process-env": "error",
        "import/order": ["error", { "newlines-between": "always" }],
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["@typescript-eslint"],
      extends: [
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
      ],
      settings: {
        "import/resolver": {
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
      },
    },
  ],
};
