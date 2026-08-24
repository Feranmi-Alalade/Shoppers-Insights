# Shopper Insights

Shopper Insights is a full-stack application for uploading shopping receipts and turning them into structured spending data — itemized purchases, category breakdowns, budgets, AI-generated health/spending recommendations, and community features. A shopper photographs or uploads a receipt; an AI vision model reads it, categorizes every line item, and the results feed a personal analytics dashboard.

The hosted version is live at **[shopper-insights.hifeyinc.com](https://shopper-insights.hifeyinc.com)**.

> **Note on project maturity:** this is an actively evolving prototype/monorepo. Several parts of the stack (see [Project Structure & Architecture Notes](#project-structure--architecture-notes) below) are experimental, mocked, or represent alternative implementations of the same feature that haven't yet converged on one canonical backend. This README documents what exists in the repo today, including what is fully wired up versus what is still a stub.

### Team
- **Team Lead / Frontend Engineer:** [Temiloluwa Adeoti](https://www.linkedin.com/in/temiadeoti)
- **DevOps / Cloud Engineer:** [Oluwategbe Tobi](https://www.linkedin.com/in/tobi-oluwategbe-01893b1a3/)
- **Data Scientist:** [Alalade Feranmi](https://www.linkedin.com/in/oluwaferanmi-alalade-8b037aa8/)

---

## What the app does

- **Receipt upload & AI extraction** — Users upload a JPEG receipt image. It's base64-encoded and sent to Google's **Gemini (`gemini-2.5-flash`)** model with a structured prompt that returns store name, date, total, an itemized list, per-item categorization (Groceries, Household, Personal Care, Electronics, Clothing, Dining, Entertainment, Other), and a category-level spend breakdown — all as JSON, which is stored in a SQL database.
- **Spending analytics dashboard** — A server-rendered **Plotly Dash** app is mounted inside the FastAPI backend (`/dashboard`) that reads stored receipts, builds a pandas DataFrame, and visualizes category spend, status, and store breakdowns, filterable by category/status.
- **AI health & spending insights** — A second Gemini prompt acts as a "nutritionist and behavioral economist," analyzing a user's full receipt history to produce a 0–100 health score, dietary analysis, spending-pattern narrative, and a list of actionable recommendations.
- **Budgeting** — Create budgets per category (amount, spent, period) and track them against actual spend.
- **Receipt history** — Browse, view, and (in the frontend mock layer) delete past receipts.
- **Community** — Pages for community posts and savings/health "challenges" (currently backed by mock data).
- **Export & sharing** — Frontend scaffolding for downloading extracted data (JSON/Excel export planned).
- **Auth & profile pages** — Login page and a profile/admin section exist in the UI; real authentication is not yet wired up (see notes below).

---

## Tech Stack

**Frontend** (`shopper-insights-app/`)
- [Next.js 15](https://nextjs.org/) (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com/) + Radix UI primitives, `lucide-react` icons
- State/data: Zustand (client state), TanStack Query (server state), React Hook Form + Zod (forms/validation)
- Charts: Recharts, Chart.js
- Client-side OCR experimentation: `tesseract.js`
- Auth scaffolding: NextAuth
- File upload: `react-dropzone`, `@uploadthing/react`
- Analytics/telemetry: PostHog, Amplitude

**Backend** — three parallel implementations coexist in this repo (see architecture notes):
1. `api_fastapi/` — a **FastAPI** REST API (SQLAlchemy ORM + SQLite), Google Generative AI (Gemini) for receipt parsing and recommendations, and an embedded Plotly Dash analytics dashboard.
2. `backend/` — an **AWS Lambda** handler triggered by S3 upload events, using Pillow for image compression and `pytesseract` for traditional OCR.
3. `api_lambda/` — a lighter-weight **API Gateway–proxy Lambda** handler serving mocked/YAML-backed responses for receipts, users, posts, challenges, and recommendations.

**Infrastructure**
- Docker + `docker-compose.yml` for running the web app and API as containers
- [Taskfile](https://taskfile.dev/) for build/push/up/down automation
- Terraform (`iac/`) for AWS infrastructure (API Gateway, Lambda) — currently partial/scaffolded
- Python dependency management via [`uv`](https://github.com/astral-sh/uv)

---

## Project Structure & Architecture Notes

```
Shoppers-Insights/
├── shopper-insights-app/    # Next.js frontend (the actual product UI)
│   └── src/app/api/         # Frontend-side Next.js API routes — in-memory MOCK data,
│                             #   used for local UI development independent of any Python backend
├── api_fastapi/              # FastAPI backend: real DB, real Gemini-based receipt parsing,
│                             #   budgets/recommendations/community endpoints, Dash dashboard
├── backend/                  # AWS Lambda: S3-triggered image compression + pytesseract OCR pipeline
├── api_lambda/                # AWS API Gateway Lambda: mock-data-backed REST handler (YAML-driven)
├── iac/                      # Terraform IaC for AWS (Lambda/API Gateway) — work in progress
├── docker-compose.yml         # Runs prebuilt web + api images together
├── Dockerfile.web / Dockerfile.api
├── Taskfile.yml                # `task build:web`, `task up`, etc.
└── pyproject.toml / uv.lock    # Root Python dependency set (spans FastAPI + Dash + Gemini deps)
```

**Things worth knowing before you dig in:**
- The **frontend currently talks to its own built-in mock API routes** (`src/app/api/...`), which hold hardcoded sample receipts/users in memory. It is not yet wired end-to-end to `api_fastapi`.
- `api_fastapi`'s budgets list, users, posts, and challenges endpoints currently read from a **hardcoded local mock JSON file path** (`dependencies.py` points at a Windows `C:\Users\...` path) rather than the database — only receipt creation/retrieval and budget creation are fully live against SQLite.
- `Dockerfile.api` builds from `backend/` and runs `uvicorn lambda_entrypoint:app`, but `backend/lambda_entrypoint.py` defines an AWS `lambda_handler`, not a FastAPI `app` — the Docker/API story for the Lambda-based backend and the FastAPI backend hasn't been reconciled yet.
- Authentication (`useAuth`) and the OCR API route are currently stubs that return placeholder values.
- `iac/shopper-insights.tf` is empty and `iac/locals.tf` still references a differently-named prior project ("BildCraft Image Translation API"), indicating the Terraform module is inherited/in-progress rather than finished.
- `google-generativeai` (Gemini) is the extraction engine actually used in `api_fastapi`; `pytesseract` (traditional OCR) is used only in the separate `backend/` Lambda pipeline.

---

## Getting Started

### Option 1 — Use the hosted app
Visit **[shopper-insights.hifeyinc.com](https://shopper-insights.hifeyinc.com)** — no setup required.

### Option 2 — Run with Docker Compose
```sh
git clone https://github.com/Feranmi-Alalade/Shoppers-Insights.git
cd Shoppers-Insights
task up      # equivalent to: docker-compose up
```
This pulls the prebuilt `web` (port 3000) and `api` (port 8000) images referenced in `docker-compose.yml`. To build your own images locally instead of pulling, see the Taskfile commands below.

### Option 3 — Run the frontend locally
```sh
cd shopper-insights-app
npm install
npm run dev
```
The app starts on `http://localhost:3000` and uses its built-in mock API routes by default — no backend or API keys required for UI development.

### Option 4 — Run the FastAPI backend locally
```sh
cd api_fastapi
uv sync                 # or: pip install -e .
# create a .env file (see Environment Variables below)
uvicorn app.main:app --reload --port 8000
```
- API docs: `http://localhost:8000/docs`
- Analytics dashboard: `http://localhost:8000/dashboard`

### Environment Variables
| Variable | Used by | Purpose |
|---|---|---|
| `GOOGLE_API_KEY` | `api_fastapi` | Auth for Gemini calls (receipt extraction & recommendations) |
| `SQL_DB_URL` | `api_fastapi` | SQLAlchemy database connection string (defaults to a local SQLite file if unset) |
| `NEXT_PUBLIC_API_BASE_URL` | `shopper-insights-app` | Base URL the frontend's `lib/api.ts` client calls |
| AWS credentials (`AWS_ACCESS_KEY_ID`, etc.) | `backend/`, `api_lambda/` | S3 access for the Lambda OCR pipeline |

---

## Automation with Taskfile
[Taskfile](https://taskfile.dev/) drives common build/deploy tasks. Install the `task` CLI from the [installation guide](https://taskfile.dev/installation/), then:

```sh
# Build images
task build:web
task build:api

# Push images to Docker Hub
task push:web
task push:api

# Start / stop services
task up
task down

# Tail logs
task logs
```

---

## API Overview (`api_fastapi`, prefix `/api/v1`)

| Endpoint | Method | Description | Data source |
|---|---|---|---|
| `/receipts` | `POST` | Upload a JPEG receipt; Gemini extracts store, items, categories, total | Live (Gemini + DB) |
| `/receipts` | `GET` | List all receipts | Live (DB) |
| `/receipts/{id}` | `GET` | Get one receipt | Live (DB) |
| `/budgets` | `POST` | Create a budget | Live (DB) |
| `/budgets` | `GET` | List budgets | Mock JSON |
| `/recommendations` | `GET` | AI-generated health score, dietary analysis, spending patterns, and tips based on receipt history | Live (Gemini) |
| `/users` | `GET` | List users | Mock JSON |
| `/posts` | `GET` | Community posts | Mock JSON |
| `/challenges` | `GET` | Community challenges | Mock JSON |
| `/dashboard` | — | Embedded Plotly Dash analytics UI | Live (DB) |

The frontend also exposes its own parallel mock endpoints under `shopper-insights-app/src/app/api/` (`/api/receipts`, `/api/v1/...`) for local development without a Python backend — see `shopper-insights-app/README.md` for that API's request/response shapes.

---

## Python Dependency Management
This project uses [uv](https://github.com/astral-sh/uv) for fast Python dependency management across the FastAPI app, Dash dashboard, and Gemini integration. See the [uv documentation](https://docs.astral.sh/uv/) for details. Dependency groups in the root `pyproject.toml` separate `backend` (Lambda/OCR), `lint`, `test`, and `api` concerns.

---

