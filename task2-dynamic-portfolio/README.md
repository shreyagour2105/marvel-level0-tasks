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

The initial content contains seven featured projects with screenshots, seven beginner-level skills, and four recent milestones. The public site uses learning-stage labels for skills.

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
npm test
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
- `GET /api/projects/:id/image` for screenshots uploaded through the dashboard
- `POST /api/auth/login`

Authenticated routes require `Authorization: Bearer <token>`:

- `POST`, `PUT`, `DELETE` for projects, skills, and achievements
- `PUT /api/profile`
- `PUT /api/auth/password`

## Persistence

Local data is created on first backend start at `backend/data/portfolio.json`. Writes use a temporary file and atomic rename. Back up this file before large content changes. JSON storage is appropriate for a single-instance personal portfolio; use a database when adding multiple administrators, concurrent writers, audit history, or high availability.

The portfolio update refreshes the featured project records and introductory copy once when it opens an older data file. It preserves existing admin accounts, other projects, and subsequent edits.

To add or replace a screenshot, open **Admin → Projects**, then create or edit a project. Choose a PNG, JPEG, or WebP up to 2 MB, enter descriptive alt text, and save. The bundled screenshots live in `frontend/public/assets/projects/`. The app stores uploads in the same JSON data file as the project record.

## Production build

```bash
npm --prefix frontend run build
NODE_ENV=production JWT_SECRET='replace-me' ADMIN_PASSWORD='replace-me' npm --prefix backend start
```

The app is then available from the backend port (default `5000`). SPA routes fall back to `frontend/dist/index.html`.

## Deployment

`render.yaml` configures a single free Render web service with ephemeral JSON storage. Before creating the service, set the secret `ADMIN_PASSWORD`. Render generates `JWT_SECRET`. Hosted edits and uploaded screenshots can be lost on restart or redeployment. To retain them across Render restarts, attach a persistent disk on a supported plan and set `DATA_FILE` to the full path of `portfolio.json` on that disk. Copy your existing data file to the disk before starting the service if you want to keep its records.

## Submission and verification

- Public portfolio: https://dynamic-portfolio-zek3.onrender.com
- Admin dashboard: https://dynamic-portfolio-zek3.onrender.com/admin
- Repository: https://github.com/shreyagour2105/marvel-level0-tasks/tree/main/task2-dynamic-portfolio

For CRUD evidence, sign in, create a temporary project or skill, edit it, verify the public page reflects the change, then delete the temporary entry. Capture before/after screenshots. Never include passwords or tokens in screenshots.

Fresh installations load the personalized seed. Existing JSON data is retained across restarts when stored on a persistent disk.

## Current limitations

- JSON persistence supports one application instance, not horizontal scaling.
- JWT logout is client-side; server-side token revocation is not implemented.
- The API has no rate limiter. Add one before exposing the login route to sustained public traffic.

## Content updates (November 2026)

- Removed the 2023 CSIR–NAL Jigyasa and 2022 Royal Society of Chemistry Take Charge milestones from the initial portfolio data.
- Simplified the initial skills to Python, C, Java (basics), cybersecurity fundamentals, Git, GitHub, and HTML/CSS basics.
- Removed public skill percentage bars and added prominent LinkedIn navigation.
- Reworded the projects section to avoid describing actual student projects as generic demo case studies.

**Deployment note:** These changes update the repository source and default seed data. Existing deployed JSON data will not automatically be overwritten. If the hosted app already has a data file, update its skills and achievements in the admin dashboard or deliberately reseed after backing up the existing data. Also redeploy the updated frontend/backend from this consolidated repository.
