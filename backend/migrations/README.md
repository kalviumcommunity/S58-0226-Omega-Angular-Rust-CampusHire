# Database Migrations

This directory contains SQL migration files for the CampusHire database schema.

## How to Execute Migrations

### Using Neon Web Console (Recommended)

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Click on "SQL Editor"
4. Copy the contents of `001_create_tables.sql`
5. Paste into the SQL Editor
6. Click "Execute"

### Using psql CLI

```bash
# Set your DATABASE_URL from .env
export DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Execute the migration
psql $DATABASE_URL -f migrations/001_create_tables.sql
```

### Using psql interactively

```bash
psql $DATABASE_URL
# Then paste the SQL from the migration file and execute
```

## Verification

After executing the migration, verify the tables exist:

```sql
-- List all tables
\dt

-- Describe students table
\d students

-- Describe jobs table
\d jobs

-- Describe applications table
\d applications
```

## Migration Files

- `001_create_tables.sql` - Creates core tables: students, jobs, applications
