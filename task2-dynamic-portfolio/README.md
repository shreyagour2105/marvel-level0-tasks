# Dynamic Portfolio & Admin Dashboard

**MARVEL Batch 9 | Level 0 – Task 2 | UVCE**

A personal engineering portfolio for Shreya S Gour.

A full-stack portfolio with a responsive public site and authenticated content dashboard. Portfolio content is served from an Express REST API and persisted to a JSON file.

## Features

- Dynamic profile, projects, skills, and achievements
- Responsive editorial portfolio with loading, empty, and error states
- JWT-protected admin dashboard with complete content CRUD
- Profile and password management
- Input validation, consistent JSON errors, and atomic file writes
- Node test suite covering public access, authentication, CRUD, validation, and persistence
- Single-service production deployment: Express serves the Vite build

The initial content contains six personal projects, twelve skills and six unique achievements. Skill percentages are self-assessment placeholders, not certified proficiency scores.

## Architecture

React/Vite frontend → Express REST API → JSON file storage. The public portfolio and authenticated admin dashboard share the same API. Production serves both interfaces from one Express service.

## Local setup

Requirements: Node.js 20 or newer and npm.

```bash
cp backend/.env.example backend/.env
npm --prefix backend install
npm --prefix frontend install
```

Run both processes in separate terminals:

```bash
npm --prefix backend run dev
npm --prefix frontend run dev
```

If macOS AirPlay Receiver is using port 5000, set `PORT=5001` in `backend/.env`, create `frontend/.env`, and set:

```env
VITE_API_URL=/api
VITE_API_PROXY_TARGET=http://localhost:5001
VITE_DEV_PORT=5173
```

- Portfolio: http://localhost:5173
- Admin: http://localhost:5173/admin
- API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

Default local sign-in (change immediately outside local development):

- Email: `admin@portfolio.dev`
- Password: `ChangeMe123!`

The default credentials are used only when no admin environment variables exist. For any shared environment, set `ADMIN_PASSWORD` before the data file is created and set a strong `JWT_SECRET`.

## Commands

```bash
npm --prefix backend test
npm --prefix backend start
npm --prefix frontend run lint
npm --prefix frontend run build
```

## API

Public routes:

- `GET /api/health`
- `GET /api/portfolio`
- `GET /api/profile`
- `GET /api/projects`, `/api/skills`, `/api/achievements`
- `POST /api/auth/login`

Authenticated routes require `Authorization: Bearer <token>`:

- `POST`, `PUT`, `DELETE` for projects, skills, and achievements
- `PUT /api/profile`
- `PUT /api/auth/password`

## Persistence

Local data is created on first backend start at `backend/data/portfolio.json`. Writes use a temporary file and atomic rename. Back up this file before large content changes. JSON storage is appropriate for a single-instance personal portfolio; use a database when adding multiple administrators, concurrent writers, audit history, or high availability.

## Production build

```bash
npm --prefix frontend run build
NODE_ENV=production JWT_SECRET='replace-me' ADMIN_PASSWORD='replace-me' npm --prefix backend start
```

The app is then available from the backend port (default `5000`). SPA routes fall back to `frontend/dist/index.html`.

## Deployment

`render.yaml` configures a single free Render web service with ephemeral JSON storage. Before creating the service, set the secret `ADMIN_PASSWORD`; Render generates `JWT_SECRET`. No paid disk is configured. Hosted edits may be lost on restart or redeployment; personalized seed content is restored on fresh startup. Persistent hosted edits require durable storage.

## Submission and verification

- Public portfolio: https://dynamic-portfolio-zek3.onrender.com
- Admin dashboard: https://dynamic-portfolio-zek3.onrender.com/admin
- Repository: https://github.com/shreyagour2105/dynamic-portfolio

For CRUD evidence, sign in, create a temporary project or skill, edit it, verify the public page reflects the change, then delete the temporary entry. Capture before/after screenshots. Never include passwords or tokens in screenshots.

Fresh installations load the personalized seed. Existing JSON data is retained across restarts when stored on a persistent disk. Production verification and screenshots remain pending.

## Current limitations

- JSON persistence supports one application instance, not horizontal scaling.
- Project visuals are generated editorial mockups; image upload is not implemented.
- JWT logout is client-side; server-side token revocation is not implemented.
- The API has no rate limiter. Add one before exposing the login route to sustained public traffic.
