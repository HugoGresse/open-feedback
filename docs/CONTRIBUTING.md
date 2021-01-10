# Contributing

Contributions, issues and feature requests are very welcome. If you are using this app and fixed a bug or improve it, please consider submitting a PR!

You can contact other contributors on Gitter or ping me at Twitter

If you want to contribute you must read and accept out Code of Conduct

## Guidelines

### General guidelines

-   The `master` branch is where incoming new features are merged and where the next deploy will come from.
-   All hotfix should be done in dedicated branch from the `master` branch.
-   All new features / bugs should be done in dedicated branch from the `master` branch.
-   Organize your commit as you wish. They will be squashed upon merging.

### Adding new feature

Ideally you should talk about it on [Gitter](https://gitter.im/open-feedback) with other contributors or open a suggestion issue on [GitHub](https://github.com/HugoGresse/open-feedback/issues).

_To learn React, check out the [React documentation](https://reactjs.org/)._

## Testing

### Setup and run test

1. Create a `.env.test.local` based on the `.env` file and set `REACT_APP_EMULATORS` to `true`.
2. `npm run cy:start` start the build with test env
3. `npm run cy:open` open cypress
4. Run the test within the Cypress console
