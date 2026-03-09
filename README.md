# Mini-SIEM Frontend

A small React SPA for exploring normalized security events stored in SQLite by the Mini-SIEM backend.

The UI provides:

- Admin login (password -> JWT)
- Log Explorer with filters + cursor pagination
- Event details drawer (core fields + raw/data JSON with copy)
- Operational views: Status (/ready) and Metrics (/metrics)
- Dark theme UI

## Tech stack

- React + TypeScript + Vite
- React Router
- Tailwind CSS
- Axios (HTTP client)
- TanStack React Query (caching, retry, polling)
- react-hot-toast (toasts)

## Requirements

- Node.js 18+ (recommended)
- npm (or pnpm/yarn)

## Configuration

### API base URL

The frontend reads the backend base URL from:

- `VITE_API_BASE_URL`

Important:

- The value MUST start with `http://` or `https://`.
- Do not use a bare host (for example `api.example.com/siem`) because the browser will treat it as a relative path.

Examples:

- Local backend: `http://localhost:8011`
- Behind Nginx under a prefix: `https://api.example.com/siem`

Create a `.env.local` file:

```bash
VITE_API_BASE_URL=https://api.example.com/siem
```

### Backend endpoints

This frontend expects the backend to expose:

Auth:

- `POST /auth/login`

Metadata:

- `GET /metadata/apps`
- `GET /metadata/event-types?app=...` (optional `app` filter)

Query:

- `GET /events` (filters + cursor pagination)
- `GET /events/{id}` (full event detail)

Operational:

- `GET /ready`
- `GET /metrics`
- `GET /health` (optional)

If your backend uses different metadata paths (for example `/apps` and `/event-types`), update `src/api/apiPaths.ts`.

## Running locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Vite will print the local URL (usually `http://localhost:5173`).

## Authentication behavior

- JWT is stored in `localStorage` (MVP).
- All protected endpoints use `Authorization: Bearer <token>`.
- If the backend returns HTTP 401 for an authenticated request, the frontend clears the token and redirects to `/login`.
- Network / 401 / 5xx errors are surfaced with toasts (deduplicated).

## Routes

- `/login` - login form
- `/` - Explorer
- `/status` - readiness view (polling)
- `/metrics` - metrics view (polling)

## Deployment (Netlify)

1. Set environment variable:

- `VITE_API_BASE_URL = https://api.example.com/siem`

2. SPA redirects:

Create `netlify.toml`:

```toml
[build]
command = "npm run build"
publish = "dist"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

3. Smoke test in production:

- Login works over HTTPS
- Explorer loads events (authorized)
- Event details drawer loads (authorized)
- Status and Metrics pages load
- Browser is not blocked by CORS
