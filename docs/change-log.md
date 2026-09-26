# Change Log

## [Unreleased]

### Added

-   Dependencies: the library is installed from Verdaccio, every version is exact, and `check-dependencies` rejects
    a range or a local link.
-   Scripts: `install:local` / `install:remote` switch the library between its local build and its published version.
-   Scripts: `lint`, `typecheck`, `test:ci`, `verify`, `format`, `check-translations` and `sort-translations`; a
    pre-commit hook runs ESLint and Prettier on the staged files.
-   Tests: the products, categories and shell configs, and the choice of language.

### Changed

-   Uses angular-components 1.2.0.
-   ESLint 9 with the library's flat config; Prettier orders template attributes.
-   Every component is `OnPush`; the shell rebuilds its menu when the session user changes.
-   Translation keys are kebab-case (`create-group`, `category-form`, `product-name`), and the merged bundles are
    sorted.
-   `start` waits for the library build only when the library is linked locally.

### Removed

-   The unused `environment.prod.ts`, and the post-build copy of the translations, which the build already does.
-   `sass`, `@angular/localize`, `chokidar-cli`, `@types/uuid` and the old ESLint packages.
