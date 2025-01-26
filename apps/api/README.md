# Rewee API

Back-End application to serve movies and TV series informations.

## Installation

### Requirements

| Tool                              | Version |
| :-------------------------------- | :------ |
| [Node.js](https://nodejs.org/en/) | >= 20.x |
| [pnpm](https://pnpm.io/)          | >= 9.x  |

Dependencies should be installed from the root of the project with:

```bash
pnpm install
```

## Usage

| Command      | Action                                       |
| :----------- | :------------------------------------------- |
| `dev`        | Starts local dev server at `localhost:5173`  |
| `build`      | Build your production site to `./dist/`      |
| `format`     | Format code in **write** mode                |
| `generate`   | Generate a migration to `./drizzle`          |
| `lint`       | Lint code in **write** mode                  |
| `migrate`    | Run database migrations in `./drizzle`       |
| `preview`    | Preview your build locally, before deploying |
| `test`       | Run unit tests                               |
| `test:ci`    | Run unit tests for CI pipelines              |
| `test:watch` | Run unit tests in **watch** mode             |

## License

[MIT](https://github.com/fthomasvp/movies-catalog/blob/main/LICENSE)
