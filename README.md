# task-manager-client

Angular frontend for the task management platform — auth, roles, org structure, clients, projects, and a Kanban task board with discussions and file attachments.

## Stack
- Angular (standalone components, signals)
- Node LTS (see `.nvmrc` — currently pinned to Node 24)

## Companion repo
Backend: [task-manager-api](https://github.com/khan65/task-manager-api) (ASP.NET Core) — **must be running** for this app to do anything useful; it's a pure API client.

## First-time setup

1. **Install Node** matching `.nvmrc` (via [nvm](https://github.com/nvm-sh/nvm) is easiest):
   ```bash
   nvm install
   nvm use
   ```

2. **Clone and install:**
   ```bash
   git clone https://github.com/khan65/task-manager-client.git
   cd task-manager-client
   npm install
   ```

3. **Make sure the backend is running first** — see [task-manager-api](https://github.com/khan65/task-manager-api)'s README. This app expects it at `http://localhost:5280` in dev (see `src/environments/environment.development.ts`).

4. **Run it:**
   ```bash
   npm start
   ```
   Serves at `http://localhost:4200`.

5. **Log in.** There's no seeded account — register a user via the backend first (see its README), then log in here with those credentials.

## Architecture

Standalone Angular components, one feature folder per module under `src/app/features/` (`login`, `dashboard`, `users`, `org-structure`, `clients`, `projects`, `tasks`). Shared pieces live under `src/app/core/`:
- `core/auth/` — `AuthService`, JWT interceptor, route guard
- `core/shell/` — the persistent nav sidebar wrapping every authenticated page
- `core/ui/modal/` — the reusable modal used by every "Add" form across the app

Design tokens (color, type, spacing) are defined once in `src/styles.css` and shared globally — feature components lean on classes like `.card`, `.btn`, `.field`, `.data-table`, `.chip` rather than redefining their own styles.

## Day-to-day

- **Run:** `npm start` (= `ng serve`)
- **Build:** `npm run build`
- Backend URL for dev is in `src/environments/environment.development.ts` — update it there if your backend runs on a different port.
