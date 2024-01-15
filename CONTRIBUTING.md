# Contributing to Terminal One

Terminal One is open-source with MIT license. Any contribution is highly appreciated!

## Setting up

Once you've cloned the repo, first run the following command to install dependencies.

```bash
npm ci
```

To start the app locally, run

```bash
npm run dev:app
```

## About this repo

This repository is a monorepo managed through [Turborepo](https://turbo.build/repo).

### Apps and Packages

- `app`: an [Electron](https://www.electronjs.org/) that hosts native logic
- `terminal`: an [Next.js](https://nextjs.org/) app that's responsible for the user interface
- `types`: a shared library that mostly contains common types used by other packages in the repo
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

### Utilities

This Turborepo utilizes some additional tools:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
