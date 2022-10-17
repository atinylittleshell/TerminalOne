module.exports = {
  "extends": [
    "airbnb-typescript/base",
    "plugin:prettier/recommended"
  ],
  "plugins": [
    "import",
    "simple-import-sort"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname,
  },
  "rules": {
    "no-console": [
      "error",
      {
        "allow": [
          "warn",
          "error"
        ]
      }
    ],
    "simple-import-sort/imports": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ]
  }
}
