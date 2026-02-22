# Database Migrations

This directory contains SQL migration files for the CampusHire database schema.

## Migration Files

- **001_create_tables.sql** - Create base schema (students, jobs, applications tables)
- **002_seed_data.sql** - Insert sample/dummy data for testing

## How to Execute Migrations

### Using Neon Web Console (Recommended)

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Click on "SQL Editor"
4. Copy the contents of the migration file
5. Paste into the SQL Editor
6. Click "Execute"

**Order of Execution:**
- First: `001_create_tables.sql` (creates the schema)
- Second: `002_seed_data.sql` (populates test data)

### Using psql CLI

```bash
# Set your DATABASE_URL from .env
export DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Execute schema migration
psql $DATABASE_URL -f migrations/001_create_tables.sql

# Execute seed data
psql $DATABASE_URL -f migrations/002_seed_data.sql
```

### Using psql interactively

```bash
psql $DATABASE_URL
# Then paste the SQL from the migration file and execute
```

## Seed Data Contents

The `002_seed_data.sql` file includes:

- **15 Student Records** - Realistic names and email addresses with staggered creation dates
- **9 Job Postings** - Various positions (Software Engineer, Frontend Dev, Full Stack, Data Scientist, DevOps, QA, Product Manager, DBA, Mobile Developer)
- **32+ Application Records** - Students applying for jobs with different statuses:
  - Applied
  - Interview Scheduled
  - Offered

This test data allows you to verify:
1. Database connectivity
2. GET /api/students endpoint
3. GET /api/jobs endpoint
4. Frontend dashboard displays students correctly
5. Jobs list displays correctly

## Verification

After executing the migrations, verify the data:

```sql
-- Count students
SELECT COUNT(*) FROM students;

-- Count jobs
SELECT COUNT(*) FROM jobs;

-- Count applications
SELECT COUNT(*) FROM applications;

-- View all students
SELECT * FROM students ORDER BY id;

-- View all jobs
SELECT * FROM jobs ORDER BY id;

-- View applications with student and job names
SELECT 
  a.id,
  s.name as student_name,
  j.title as job_title,
  a.status,
  a.applied_at
FROM applications a
JOIN students s ON a.student_id = s.id
JOIN jobs j ON a.job_id = j.id
ORDER BY a.applied_at DESC;
```

## Important Notes

- Seed data uses `NOW()` for timestamps, so dates will be relative to when you run the commands
- All student emails follow the pattern: `firstname.lastname@campus.edu`
- Salary values are in INR (Indian Rupees)
- Application statuses are: 'Applied', 'Interview Scheduled', 'Offered'


## Migration Files

- `001_create_tables.sql` - Creates core tables: students, jobs, applications
