/*
# Create users table for SaaS MVP

## Purpose
Stores user accounts for the SaaS MVP application. Each user has an email, 
hashed password, name, and timestamps. This table is managed by Prisma ORM 
from the Express backend, using the Supabase Postgres database as the data store.

## New Tables
- `users`
  - `id` (uuid, primary key, auto-generated)
  - `email` (text, unique, not null) — user's email address
  - `password` (text, not null) — bcrypt-hashed password
  - `name` (text, not null) — user's display name
  - `created_at` (timestamptz, default now()) — account creation timestamp
  - `updated_at` (timestamptz, default now()) — last update timestamp

## Security
- RLS enabled on `users` table.
- All CRUD operations are scoped to `authenticated` role with ownership checks (auth.uid() = id).
- This table is separate from Supabase's built-in auth.users — it is managed by the 
  Express backend's own JWT auth system, not Supabase Auth.

## Notes
1. The Express backend connects to this database via the Supabase pooler connection string.
2. Passwords are hashed with bcrypt (10 rounds) before storage — never plaintext.
3. The backend issues its own JWT tokens; Supabase RLS is a defense-in-depth layer.
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON users;
CREATE POLICY "users_select_own" ON users FOR SELECT
  TO authenticated USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "users_insert_own" ON users;
CREATE POLICY "users_insert_own" ON users FOR INSERT
  TO authenticated WITH CHECK (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own" ON users FOR UPDATE
  TO authenticated USING (auth.uid()::text = id::text) WITH CHECK (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "users_delete_own" ON users;
CREATE POLICY "users_delete_own" ON users FOR DELETE
  TO authenticated USING (auth.uid()::text = id::text);
