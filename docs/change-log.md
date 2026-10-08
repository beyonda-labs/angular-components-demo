# Change Log

## [1.3.0] - 2026-10-09

### Changed

-   Uses angular-components 1.3.0: typed page configs, `provideBeyApp`, the routed shell and the trash enabled on the
    table config of the categories page.
-   Pages organised as `rules/angular/page.md` sets, with their logic in function modules and specs on the library's
    testing entry.
-   Tooling from base-config: ESLint 9 with the declaration, class-order and signal rules, Prettier and the Jest
    resolver.

## [1.1.0] - 2026-09-26

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
