# Black Space Canada

A community platform for Black Canadian engineers, scientists, and technologists building Canada's space and defence systems.

**Website:** [blackspace.ca](https://blackspace.ca)

## Tech Stack

- **Frontend:** Angular 21, TypeScript 5.9
- **Backend:** .NET 9, ASP.NET Core Minimal API, Entity Framework Core
- **Database:** PostgreSQL 17 (local dev via Docker), SQLite (prod)
- **Testing:** Vitest (frontend unit), Playwright (E2E), xUnit (backend)

## Project Structure

```
src/
  BlackSpace.Api/            # ASP.NET Core Web API
  BlackSpace.Domain/         # Entities, DTOs, interfaces
  BlackSpace.Infrastructure/ # EF Core, repositories, services
  BlackSpace.Web/            # Angular monorepo
    projects/
      blackspace/            # Main SPA (public site)
      blackspace-admin/      # Admin dashboard SPA
      api/                   # API client library
      components/            # Shared component library
      domain/                # Domain/feature library
    e2e/
      admin/                 # Admin Playwright E2E tests
tests/
  BlackSpace.Tests/          # .NET integration tests
docs/
  specs/                     # Requirements (L1, L2)
  admin-design.pen           # Admin UI design file
eng/scripts/                 # Dev workflow scripts
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (LTS)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Local Development

### Start everything (database + backend + frontend)

```bash
eng/scripts/dev-start.sh
```

This single command will:
1. Start PostgreSQL in Docker (data persisted in a named volume)
2. Build and run the .NET API on `http://localhost:5000`
3. Start the Angular dev server on `http://localhost:4200`
4. Start the Admin Angular dev server on `http://localhost:4201`
5. Print timing metrics for each step

### Stop everything

```bash
eng/scripts/dev-stop.sh
```

Gracefully stops frontend, backend, and the database container. Data is preserved.

### Reset (wipe database)

```bash
eng/scripts/dev-reset.sh
```

Stops everything and deletes the Docker volume so you start with a clean database.

### Endpoints

| Service   | URL                              |
|-----------|----------------------------------|
| Frontend  | http://localhost:4200             |
| Admin     | http://localhost:4201             |
| API       | http://localhost:5000             |
| Swagger   | http://localhost:5000/swagger     |
| Health    | http://localhost:5000/api/health  |
| Database  | localhost:5432                    |

### Running Tests

```bash
# Frontend unit tests (all libraries + apps)
cd src/BlackSpace.Web
npx ng test components --no-watch
npx ng test api --no-watch
npx ng test domain --no-watch
npx ng test blackspace --no-watch
npx ng test blackspace-admin --no-watch

# Backend integration tests
dotnet test tests/BlackSpace.Tests/

# Playwright E2E tests (requires services running)
cd src/BlackSpace.Web
npx playwright test e2e/admin/
```

### Debugging

Both the backend and frontend run **outside Docker** so you can attach debuggers and set breakpoints directly.

**VS Code (recommended):** Open the repo root. Use the launch configurations in `.vscode/launch.json`:

- **Debug: .NET API** — Launches the API with the debugger attached. Set breakpoints in any `.cs` file.
- **Debug: Angular (Chrome)** — Opens Chrome with DevTools source maps. Set breakpoints in any `.ts` file. (Requires the Angular dev server to be running.)
- **Debug: .NET API + Angular** — Launches the API and opens Chrome for frontend debugging in one step.

**Workflow:** Run `eng/scripts/dev-start.sh` to get the database running, then use the VS Code launch configs to debug either the API, the frontend, or both with breakpoints.

### Metrics

Startup and shutdown timing metrics are logged to `.dev/metrics.log`. Process logs are in `.dev/logs/`.

## Applications

### Public Site (`blackspace`)

The main public-facing single-page application at `http://localhost:4200`. Landing page with hero, problem statement, audience cards, pillars, signup form, founder bio, and footer.

### Admin Dashboard (`blackspace-admin`)

Internal admin dashboard at `http://localhost:4201` for managing the community. Built with Angular Material (dark theme).

- **Dashboard** — Member stats, recent signups, quick actions
- **Members** — Searchable/sortable member table with edit and delete
- **Content** — Manage next meetup date and referral source options

### API

.NET 9 REST API at `http://localhost:5000`. Endpoints:

- `POST /api/members` — Public signup
- `GET /api/content/*` — Public content
- `GET/PUT/DELETE /api/admin/members` — Admin member CRUD
- `GET/PUT /api/admin/content/*` — Admin content management
- `GET /api/health` — Health check

## License

All rights reserved.
