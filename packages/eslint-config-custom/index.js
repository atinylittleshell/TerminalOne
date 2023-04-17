module.exports = {
  extends: ['next', 'turbo', 'eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['simple-import-sort'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'simple-import-sort/imports': 'warn',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
};
