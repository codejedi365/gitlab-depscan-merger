export default {
  root: true,
  env: {
    commonjs: true,
    es2017: true
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:mdx/recommended",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 8,
    project: "./tsconfig.json"
  },
  settings: {
    "mdx/code-blocks": true
  },
  ignorePatterns: ["dist/**"],
  overrides: [
    {
      files: ["**.test.ts"],
      env: {
        jest: true
      }
    },
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ],
  rules: {
    "no-console": "off",
    // webpack handles all dependencies to generate remaining bundle
    "import/no-extraneous-dependencies": "off"
  }
};
