
# CampusHire - College Placement Portal

## Overview

A simple college placement management portal with:
- **Frontend**: Angular 21 (standalone components, SSR-ready)
- **Backend**: Rust with Actix-web (async, minimal)
- **Database**: PostgreSQL via Neon (cloud-hosted)

---

## I. Tech Stack

- **Frontend**: Angular 21.1.4 with standalone components
- **Backend**: Rust with Actix-web and async runtime
- **Database**: Neon PostgreSQL (cloud)
- **Development Servers**:
  - Backend: `http://localhost:8080`
  - Frontend: `http://localhost:4200`

---

## II. Quick Start

```bash
# Backend
cd backend
cargo run

# Frontend (in new terminal)
cd frontend
npm install
npm start
```

## III. Database Setup (Neon PostgreSQL)

1. Create a project on [Neon](https://neon.tech)
2. Copy the connection string to `.env`:
   ```
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```
3. Create basic tables:

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  salary_min INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Applied',
  applied_at TIMESTAMP DEFAULT now()
);
```

## IV. Rust Backend - Basic Setup

**Framework**: Actix-web

**Dependencies**:
```toml
[dependencies]
actix-web = "4"
actix-cors = "0.7"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
chrono = "0.4"
```

**Basic Endpoints**:
- `GET /` - Health check
- `GET /api/status` - Server status
- `POST /api/echo` - Echo endpoint for testing
- (Future) CRUD endpoints for students, jobs, applications

**CORS Configuration**:
- Allow requests from `http://localhost:4200` (Angular frontend)

## V. Angular Frontend

**Structure**: Standalone components (Angular 21+ style)

**Key Services**:
- `ApiService` - HTTP calls to backend
- Setup routing with guards if needed
- Create basic pages: Dashboard, Jobs, Applications

**Key Pages**:
- Home/Dashboard
- Job Listings
- Application Management
- Student Profile

**Libraries**:
- Angular Forms (Reactive Forms)
- HttpClient for API calls
- Router for navigation

## VI. Development Workflow

**File Structure**:
```
backend/
  ├── Cargo.toml
  ├── src/
  │   └── main.rs
  └── .env (DATABASE_URL)

frontend/
  ├── package.json
  ├── src/
  │   ├── app/
  │   │   ├── app.ts
  │   │   ├── app.html
  │   │   └── app.css
  │   └── services/
  │       └── api.service.ts
  └── angular.json
```

**Running the Project**:
1. Start backend: `cd backend && cargo run`
2. Start frontend: `cd frontend && npm install && npm start`
3. Access: `http://localhost:4200`

---

## Project Execution: 20 Steps

Track progress by creating a new branch for each step. Mark completed steps with ✅.

### ✅ Completed - Foundation

- [x] **Step 0 (DONE)**: Project structure & setup
  - Commit: `feat: Restructure project layout and simplify setup`
  - Created: backend/, frontend/, .env, .gitignore, start scripts

### Backend Setup (Steps 1-8)

- [✅] **Step 1**: Create main.rs with basic server (GET / endpoint)
  - Branch: `feat/step-1-basic-server`
  - Test: `cargo run` on localhost:8080

- [✅] **Step 2**: Configure CORS for localhost:4200
  - Branch: `feat/step-2-cors-setup`
  - Verify: Angular can make cross-origin requests

- [✅] **Step 3**: Create GET /api/status endpoint
  - Branch: `feat/step-3-status-endpoint`
  - Returns: `{ "status": "running", "timestamp": "..." }`

- [✅] **Step 4**: Create POST /api/echo endpoint
  - Branch: `feat/step-4-echo-endpoint`
  - Returns: echoes back the request body

- [x] **Step 5**: Set up .env and DATABASE_URL configuration
  - Branch: `feat/step-5-env-config`
  - Add dotenv or similar for loading DATABASE_URL

- [x] **Step 6**: Create database schema migration file
  - Branch: `feat/step-6-database-schema`
  - Execute SQL for students, jobs, applications tables
  - Verify tables exist in Neon

- [ ] **Step 7**: Create basic GET /api/students endpoint (read all)
  - Branch: `feat/step-7-students-endpoint`
  - Returns: JSON array of students from database

- [ ] **Step 8**: Create GET /api/jobs endpoint (read all)
  - Branch: `feat/step-8-jobs-endpoint`
  - Returns: JSON array of jobs from database

### Frontend Setup (Steps 9-14)

- [ ] **Step 9**: Configure Angular ApiService with HttpClient
  - Branch: `feat/step-9-api-service`
  - Methods: GET, POST for backend calls

- [ ] **Step 10**: Create Student Dashboard component
  - Branch: `feat/step-10-student-dashboard`
  - Display: List of students fetched from backend

- [ ] **Step 11**: Create Jobs List component
  - Branch: `feat/step-11-jobs-list`
  - Display: Job listings from backend

- [x] **Step 12**: Set up main routing (Home, Jobs, Dashboard)
  - Branch: `feat/step-12-routing`
  - Routes: /, /jobs, /dashboard

- [x] **Step 13**: Create Application Form component
  - Branch: `feat/step-13-application-form`
  - Form: Student applies for jobs + validation

- [ ] **Step 14**: Create Student Profile component
  - Branch: `feat/step-14-student-profile`
  - Display: Student info + applications history

### Backend CRUD (Steps 15-17)

- [x] **Step 15**: Create POST /api/students endpoint (create student)
  - Branch: `feat/step-15-create-student`
  - Accepts: name, email
  - Returns: created student with ID

- [x] **Step 16**: Create POST /api/jobs endpoint (create job)
  - Branch: `feat/step-16-create-job`
  - Accepts: title, company, description, salary_min
  - Returns: created job with ID

- [x] **Step 17**: Create POST /api/applications endpoint (apply for job)
  - Branch: `feat/step-17-apply-job`
  - Accepts: student_id, job_id
  - Returns: application with status "Applied"

### Integration & Polish (Steps 18-20)

- [ ] **Step 18**: Test full backend-frontend integration
  - Branch: `feat/step-18-integration-test`
  - Verify: Create student → Apply for job → See in dashboard

- [ ] **Step 19**: Add error handling & basic validation
  - Branch: `feat/step-19-error-handling`
  - Backend: Return proper HTTP status codes
  - Frontend: Display error messages to user

- [ ] **Step 20**: Deployment readiness & final testing
  - Branch: `feat/step-20-final-deployment`
  - Test: Full workflow end-to-end
  - Cleanup: Remove console logs, optimize

---

### How to Use This Checklist

1. **For each step**, create a new branch: `git checkout -b feat/step-X-description`
2. **Complete the work** for that step
3. **Test** locally (backend on :8080, frontend on :4200)
4. **Commit** with message: `feat: step X - description`
5. **Mark the checkbox** in this file: change `- [ ]` to `- [x]`
6. **Push** and optionally create a Pull Request
7. **Move to next step**

---




