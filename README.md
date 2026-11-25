# Product Catalogue PoC

A full-stack product catalogue Proof of Concept backed by [FakeStoreAPI](https://fakestoreapi.com), with server-side caching, category browsing, keyword search, and a local email enquiry workflow.

---

## Tech Stack Choice & Rationale

| Layer | Choice | Why |
|---|---|---|
| **Client** | **Next.js 14 (React 18) + TypeScript + Tailwind CSS + TanStack Query + React Hook Form** | App Router gives clean file-based routing (`/`, `/categories`, `/products`, `/products/[id]`), TanStack Query handles server-state caching/loading/error states cleanly, React Hook Form provides lightweight inline validation for the enquiry modal, and Tailwind CSS enables rapid, consistent UI styling. |
| **Backend** | **Node.js 20 + Express + TypeScript + Zod + Nodemailer** | Minimal, fast to scaffold within a PoC timeframe, with strict TypeScript interfaces (`CatalogProvider`, `EmailProvider`), Zod request validation middleware, and Nodemailer for standard SMTP email delivery. |
| **Local Email** | **Mailpit** | Zero-config local SMTP server + web UI so reviewers can verify enquiry emails without creating any external account or using paid services. |

---

## Architectural & Compliance Checklist

- **No direct client calls to FakeStoreAPI:** All product and category requests from the React client go strictly through the Express backend (`/api/products`, `/api/categories`, `/api/enquiry`).
- **AWS-compatible infrastructure:** Both `back-end/` and `front-end/` ship with standard `Dockerfile`s orchestrated via `docker-compose.yml`, ready for AWS ECS / Fargate / App Runner. `EmailAdapter` uses standard SMTP environment variables (swappable for AWS SES without code changes).
- **No secrets committed:** All configuration is driven by environment variables documented in [`.env.example`](.env.example).
- **Zero paid services or accounts required:** Runs completely locally using FakeStoreAPI and the bundled Mailpit container.

---

## Quick Start (Under 10 Minutes)

### Option 1: Docker Compose (Recommended — 1 command)

```bash
docker compose up --build
```

Once running:
- **Frontend App:** http://localhost:3000
- **Backend API:** http://localhost:4000/api
- **Mailpit Email UI:** http://localhost:8025 (captures all enquiry emails sent from the app)

---

### Option 2: Run Locally Without Docker

1. **Start Mailpit** (for local SMTP):
   ```bash
   docker run -p 8025:8025 -p 1025:1025 axllent/mailpit
   ```

2. **Start the Backend**:
   ```bash
   cd back-end
   cp ../.env.example .env
   # Update SMTP_HOST=localhost in back-end/.env if running outside Docker Compose
   npm install
   npm run dev
   ```

3. **Start the Frontend**:
   ```bash
   cd front-end
   echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api" > .env.local
   npm install
   npm run dev
   ```

---

## Running Tests

```bash
# Backend (Jest + Supertest)
cd back-end && npm test

# Frontend (Jest + React Testing Library)
cd front-end && npm test
```

---

## Project Structure

- [`back-end/`](back-end) — Express API (`validators/`, `controllers/`, `routes/`, `adapters/`, `types/`)
- [`front-end/`](front-end) — Next.js App Router UI (`src/app/`, `src/api/`, `src/components/`)
- [`PLAN.md`](PLAN.md) — Architecture & implementation plan
- [`DECISIONS.md`](DECISIONS.md) — Architectural and design decisions log
- [`AI_USAGE.md`](AI_USAGE.md) — Issues & mistakes caught during review
