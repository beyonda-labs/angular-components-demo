# angular-components-demo

Demo application for the `@beyonda-labs/angular-components` library. It acts as a live style guide, showcasing all available components and their configuration options.

## Requirements

- Node.js 20+
- The `angular-components` library built locally at `../angular-components/dist`

## Setup

```bash
npm install
```

## Development

Start the dev server with live library reloading:

```bash
npm start
```

This runs the Angular app and watches the local library for changes. Open `http://localhost:4200` in your browser.

To reload only the library without watching:

```bash
npm run lib:refresh
```

## Testing

```bash
npm test
```

## Translations

Translation files for the demo app live in `src/assets/i18n/`. The library translations are merged in automatically via:

```bash
npm run merge-translations
```

This is also run automatically before every build.

## Build

```bash
npm run build
```

The production build is output to `dist/`. Translation files are merged and updated as part of the build.
