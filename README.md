# Binaried

Binaried is a small task manager built as a demo application. It pairs an Angular standalone client with an Express and MongoDB API. The product intentionally uses one shared demo account so the task workflow can be explored without real account management.

## Stack

- Angular 22 standalone application with Tailwind CSS and Angular CDK
- Express 5 API written in TypeScript and run with Bun
- MongoDB 8 with Mongoose 8
- Bun workspaces for the `client` and `server` packages

## Prerequisites

- [Bun](https://bun.sh/) 1.2 or later
- Docker Compose

## Run locally

1. Install the workspace dependencies from the repository root.

   ```bash
   bun install
   ```

2. Create the server environment file.

   ```bash
   cp server/.env.example server/.env
   ```

3. Start MongoDB.

   ```bash
   docker compose up -d mongo
   ```

4. Start the API and Angular client in separate terminals.

   ```bash
   bun run dev:server
   bun run dev:client
   ```

   Or start both with `bun run dev`.

5. Open `http://localhost:4200` and sign in with:

   ```text
   username: admin
   password: admin123
   ```

The API listens on `http://localhost:3000` and the client is configured to call `http://localhost:3000/api`.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the API and Angular development server together |
| `bun run dev:server` | Start only the API |
| `bun run dev:client` | Start only the Angular client |
| `bun run build` | Create the production Angular build |
| `bun run typecheck` | Type-check both workspaces |
| `bun --filter server run test` | Run the API integration suite |
| `bun --filter client run test` | Run Angular unit tests |

The API integration suite uses `binaried_test` by default and clears only that test database’s task collection. Set `MONGODB_TEST_URI` in `server/.env` if you need a different test database.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | API health check |
| `POST` | `/api/login` | Demo credential check |
| `GET` | `/api/tasks` | List tasks with status and sort query parameters |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Read a task |
| `PATCH` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

`GET /api/tasks` accepts `status=all|todo|in-progress|done`, `sort=dueDate|createdAt|status`, and `direction=asc|desc`.

## Notes for Linux 6.19+

The Compose service includes `GLIBC_TUNABLES=glibc.pthread.rseq=1`. This is required for the MongoDB 8 image on Linux kernel 6.19 and newer; without it, MongoDB exits during startup.

## Deliberately out of scope

This demo does not implement real registration, users, password hashing, sessions, JWTs, pagination, roles, automated browser E2E tests, CI/CD, or deployment. Authentication is strictly a local `isLoggedIn` flag paired with the hard-coded demo credential check.
