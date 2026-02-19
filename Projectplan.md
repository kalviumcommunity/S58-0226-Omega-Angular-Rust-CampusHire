
# Minimalist College Placement Management Portal(CampusHire) — Project Plan

## Overview

This project pairs an Angular frontend (the "Receptionist") with a Rust backend (the "Manager") to build a performant, type-safe placement portal. Angular handles UI, routing, and client-side validation. Rust (with async runtimes and sqlx) manages business logic, database access, and authentication. The architecture targets sub-200ms responses under load and enforces compile-time guarantees where possible.

---

## I. Project Initialization & Environment

Goal: Establish a reproducible dual-repo structure and tooling that cleanly separates frontend and backend concerns.

- Quick setup checklist:

```bash
mkdir placement-portal && cd placement-portal
cargo init backend --bin           # Rust backend
ng new frontend --routing --style=scss  # Angular frontend
touch docker-compose.yml
```

- Add to `.gitignore`:
	- `backend/target/`
	- `frontend/node_modules/`

- Initial repository checklist:
	- [ ] Initialize `placement-portal` root
	- [ ] `backend` (Rust) scaffolded
	- [ ] `frontend` (Angular) scaffolded
	- [ ] `docker-compose.yml` placeholder created

---

## II. Data Engine: PostgreSQL + Rust

Principles: Schema-first design, compile-time SQL checks (with `sqlx`), connection pooling, and clear referential integrity.

- Core tasks:
	- Configure `sqlx` with `PgPoolOptions` and a connection pool.
	- Use JWT for authentication; encode roles (Student, Officer) in tokens.

- Minimal core DDL (example):

```sql
CREATE TABLE students (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE officers (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL
);

CREATE TABLE jobs (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	company TEXT NOT NULL,
	min_salary INTEGER,
	created_by INTEGER REFERENCES officers(id) ON DELETE SET NULL
);

CREATE TABLE applications (
	id SERIAL PRIMARY KEY,
	student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
	job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
	status TEXT NOT NULL DEFAULT 'Applied',
	applied_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE skills (
	id SERIAL PRIMARY KEY,
	name TEXT UNIQUE NOT NULL
);

CREATE TABLE student_skills (
	student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
	skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
	PRIMARY KEY (student_id, skill_id)
);
```

Notes: make important FK actions explicit (e.g., cascade deletes for `applications` when a `job` is removed).

---

## III. Rust Backend Scaffolding

Recommended stack and responsibilities:

- Framework: `axum` or `actix-web` (both async; `axum` is ergonomic with Tower middleware).
- Key dependencies:
	- `tokio` (async runtime)
	- `axum` / `actix-web` (HTTP)
	- `sqlx` (compile-time checked SQL)
	- `serde` / `serde_json` (JSON serialization)
	- `jsonwebtoken` (JWT support)

- API responsibilities:
	- Authentication endpoints (login, refresh)
	- Student CRUD
	- Job posting & filtering (e.g., `GET /jobs?min_salary=...`)
	- Application management (state transitions)
	- Analytics endpoints (aggregations for dashboard)

Implementation notes:
- Prefer `sqlx::query!` or migrate to `sqlx::query_as!` for typed rows.
- Centralize configuration (DB URL, JWT secret) and expose typed settings.

---

## IV. Angular Frontend Architecture

Design goal: modular, lazy-loadable, and testable UI with a thin API service layer.

- Recommended module structure:
	- `CoreModule` — singletons (`AuthService`, `ApiService`)
	- `SharedModule` — shared components (buttons, loaders, pipes)
	- Feature modules — `StudentModule`, `OfficerModule`, `JobModule` (lazy-loaded)

- Key frontend tasks:
	- `ApiService`: centralize HTTP calls using `HttpClient` and map DTOs.
	- Routing: `AppRoutingModule` with guarded routes for student/officer roles.
	- Student Dashboard: use RxJS streams (`Observable<Application[]>`) for reactive updates.
	- Officer Interface: aggregated metrics + drill-down profiles.
	- Forms: Angular Reactive Forms with validators (`Validators.required`, `Validators.min`, etc.).

---

## V. Intelligent Workflows & Business Logic

Automate eligibility and scoring in the backend for reliability and auditability.

- Features to implement in Rust:
	- Eligibility trait: evaluate candidate fit before final submission.
	- Resume extraction: lightweight keyword extraction from uploaded PDFs; store normalized keywords.
	- Scoring/ranking: function that computes a `match_score` from skills/requirements.
	- Interview state machine: strict `enum` for `Applied`, `Screening`, `InterviewScheduled`, `Placed`, `Rejected`.

Implementation notes:
- Keep matching logic deterministic and test-covered; expose scoring endpoints for officer usage.

---

## VI. Deployment, Observability & Final Verification

Goals: containerized, observable, and secure production deployment.

- Containerization:
	- Use multi-stage `Dockerfile` for both frontend and backend.
	- Compose a `docker-compose.yml` for local integration and development.

- Observability & analytics:
	- Expose aggregations (`SELECT status, count(*) FROM applications GROUP BY status`) from Rust as JSON.
	- Integrate logging and basic metrics (request latencies, DB pool saturation).

- Final deployment checklist:
	- [ ] End-to-end: student can login, apply, and see status updates.
	- [ ] JWT tokens expire and are rejected after expiry.
	- [ ] CORS configured for cross-subdomain access between Angular and Rust.
	- [ ] Referential integrity: deleting a job cascades to its applications.

---

## Appendix — High-level 20-Step Summary

1. Environment Standardization (create repos, .gitignore)
2. DDL / PostgreSQL schema (core tables)
3. Rust API scaffold (axum/actix)
4. Add `serde`, `tokio`, `sqlx` dependencies
5. Configure `sqlx` and connection pools
6. JWT-based auth (roles encoded)
7. Student Profile CRUD
8. Job posting & filtering endpoints
9. ApiService in Angular
10. App routing and guards
11. Student dashboard (RxJS streams)
12. Officer admin UI
13. Reactive job application forms
14. Eligibility trait in Rust
15. Resume parsing / keyword extraction
16. Scoring & ranking algorithm
17. Interview workflow enum/state machine
18. Analytics endpoints for dashboard
19. Docker multi-stage builds
20. Deploy to cloud and run final verification checklist

---

If you'd like, I can now:
- apply a starter `docker-compose.yml`,
- scaffold the `backend` `Cargo.toml` with suggested dependencies, or
- generate the `frontend` Angular module skeletons.


