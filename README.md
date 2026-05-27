# localgov_base_croydon

Croydon sub theme using localgov_base.

This is a sub theme for croydon.gov.uk using localgov_base as its base theme.

## Frontend build

SCSS sources live in `assets/scss/`. Compiled CSS is written to `assets/css/`.

### Requirements

- [Node.js](https://nodejs.org/) 18 or newer (Node 22 LTS recommended)
- [nvm](https://github.com/nvm-sh/nvm) (optional, but recommended)

An `.nvmrc` file is included. From this directory:

```bash
nvm install
nvm use
```

### Setup

```bash
npm install
```

### Commands

Compile CSS once (no file watching):

```bash
npx gulp generate
```

Watch SCSS and recompile on change, with BrowserSync proxying the local site:

```bash
npm run dev
```

Lint and fix CSS:

```bash
npm start
```

Styles are compiled with [Dart Sass](https://sass-lang.com/dart-sass/) via `gulp-sass` 5. Sass deprecation warnings from Bootstrap 4 are expected and do not indicate a failed build.

## Maintainers

This project is maintained by:

- Chris Stevens https://github.com/cjstevens78
- Matt Ozogolu https://github.com/MattOz-CDS
- Adnan Muhammad https://github.com/Adnan-cds
