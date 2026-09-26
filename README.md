# angular-components-demo

Demo application for `@beyonda-labs/angular-components`. It serves the library's style guide at `/demo` and two
pages built on the page module, products and categories, behind the library's session guard.

## Requirements

-   Node.js 22 and pnpm 10, through `corepack enable`.
-   Access to the Verdaccio registry at `https://verdaccio.home.arpa/`, where `.npmrc` sends the `@beyonda-labs`
    scope. Its certificate is signed by the internal Caddy CA, so Node has to trust it:
    `NODE_EXTRA_CA_CERTS=<path to the Caddy root certificate>`.

## Setup

```bash
pnpm install
```

Every dependency is pinned to an exact version, and `.npmrc` sets `save-exact` so `pnpm add` keeps it that way.

## Working against the local library

The demo installs the published library. To try unpublished changes, switch to the local build and back:

```bash
pnpm run install:local    # links every package in local-dependencies.json to its folder
pnpm start                # serves the demo and restarts it whenever the library build changes
pnpm run install:remote   # restores the version committed in HEAD
```

`install:local` needs the library built first (`pnpm run build` or `build:watch` in `angular-components`). A local
link never reaches a commit: `check-dependencies` fails in `lint`, in the pre-commit hook and in Jenkins.

## Scripts

| Script               | What it does                                                                        |
| -------------------- | ----------------------------------------------------------------------------------- |
| `start`              | Dev server on port 4200; with a local library it restarts when the library rebuilds |
| `build`              | Production build into `dist/angular-components-demo/`, merging translations first   |
| `lint`               | ESLint, `typecheck`, `check-translations` and `check-dependencies`                  |
| `lint:fix`           | ESLint with autofix                                                                 |
| `typecheck`          | TypeScript over every file, specs included                                          |
| `test` / `test:ci`   | Jest                                                                                |
| `format`             | Prettier, including the order of template attributes                                |
| `verify`             | `lint`, `format:check` and `test:ci`: everything to run before a commit             |
| `merge-translations` | Merges the demo's texts with the library's into `src/assets/i18n/`, sorted          |
| `sort-translations`  | Sorts the demo's translation sources                                                |

## Translations

Each page keeps its texts next to it, in `<page>/assets/<page>.en.json` and `.es.json`, under
`angular-components-demo.<page>.*`. `merge-translations` merges them with the library bundles into
`src/assets/i18n/<lang>.json`, which is generated and never edited by hand.

## CI

Jenkins runs `pnpm install --frozen-lockfile`, `pnpm run lint`, `pnpm run test:ci` and `pnpm run build`, and keeps
the contents of `dist/angular-components-demo/browser` as the build artefact.
