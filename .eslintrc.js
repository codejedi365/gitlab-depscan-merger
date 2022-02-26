const invalidCodeBlockRules = {
  // Invalid rules for embedded code-blocks
  "import/no-unresolved": "off",
  "no-undef": "off",
  "no-unused-expressions": "off",
  "no-unused-vars": "off",
  "no-unreachable": "off"
};

module.exports = {
  root: true,
  overrides: [
    {
      files: ["*.json", ".remarkrc"],
      plugins: ["json-format"]
    },
    {
      files: ["*.ts"],
      excludedFiles: ["*.md/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "tsconfig.eslint.json",
        sourceType: "module"
      },
      plugins: ["@typescript-eslint"],
      extends: [
        "eslint:recommended",
        "airbnb-base",
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended"
      ],
      rules: {
        // webpack handles all dependencies to generate remaining bundle
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true }
        ],
      }
    },
    {
      files: ["**.systest.ts", "**.spec.ts"],
      env: {
        "jest/globals": true
      },
      extends: [
        "plugin:jest/recommended",
        "plugin:jest/style",
      ],
      plugins: ["jest"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true }
        ],
        "no-console": "off",
        "@typescript-eslint/no-non-null-assertion": "off" // Tests should throw errors, jest will catch them
      }
    },
    {
      files: ["*.js"],
      excludedFiles: ["*.json"],
      extends: [
        "eslint:recommended",
        "airbnb-base",
        "plugin:prettier/recommended"
      ]
    },
    {
      files: ["*.md"],
      extends: ["plugin:mdx/recommended"],
      settings: {
        "mdx/code-blocks": true
      }
    },
    {
      // Markdown JS code-blocks (virtual filepath)
      files: ["**/*.md/*.js"],
      rules: {
        ...invalidCodeBlockRules
      }
    }
  ]
};
