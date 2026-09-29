# SaaS MVP Boilerplate

A production-ready SaaS starter with React + Vite + TypeScript frontend, Node.js + Express + TypeScript backend, and PostgreSQL with Prisma ORM.

## Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router
- **Backend:** Node.js, Express, TypeScript, JWT auth, Zod validation
- **Database:** PostgreSQL, Prisma ORM

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (local or cloud connection string)

### Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Copy the example files and fill in your values:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   Edit `backend/.env` — set `DATABASE_URL` to your PostgreSQL connection string and pick a `JWT_SECRET`.

   Edit `frontend/.env` — set the backend URL (defaults to `http://localhost:3000`).

3. **Run database migration and seed:**

   ```bash
   npm run db:migrate -w backend
   npm run db:seed -w backend
   ```

   This creates the User table and inserts a test user:

   - Email: `test@example.com`
   - Password: `password123`

4. **Start both servers:**

   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Project Structure

```
saas-mvp/
├── package.json          # Root workspace + concurrently
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── index.ts      # Express app entry
│       ├── config.ts     # Env config
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   └── user.routes.ts
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   └── error.middleware.ts
│       ├── services/
│       │   └── auth.service.ts
│       ├── utils/
│       │   └── jwt.util.ts
│       └── validators/
│           └── auth.validator.ts
├── frontend/
│   ├── package.json
│   ├── .env.example
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       │   ├── Layout.tsx
│       │   ├── Sidebar.tsx
│       │   └── ProtectedRoute.tsx
│       ├── pages/
│       │   ├── Landing.tsx
│       │   ├── Login.tsx
│       │   ├── SignUp.tsx
│       │   ├── ForgotPassword.tsx
│       │   ├── Dashboard.tsx
│       │   └── Settings.tsx
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── lib/
│       │   ├── api.ts
│       │   └── auth.ts
│       └── types/
│           └── index.ts
```

## API Endpoints

| Method | Path              | Auth | Description              |
|--------|-------------------|------|--------------------------|
| POST   | /api/auth/register| No   | Create account           |
| POST   | /api/auth/login   | No   | Login, returns JWT       |
| POST   | /api/auth/refresh | No   | Refresh expired token    |
| POST   | /api/auth/logout  | Yes  | Invalidate session       |
| GET    | /api/user/me      | Yes  | Get current user profile |
| PATCH  | /api/user/me      | Yes  | Update profile           |
| GET    | /api/user/me      | Yes  | Health check (auth)      |

## Scripts

| Command                          | Description                         |
|----------------------------------|-------------------------------------|
| `npm run dev`                    | Start frontend + backend together   |
| `npm run dev:server`             | Start backend only                  |
| `npm run dev:web`                | Start frontend only                 |
| `npm run build`                  | Build both services                 |
| `npm run db:migrate -w backend`  | Run Prisma migrations               |
| `npm run db:seed -w backend`     | Seed database with test user        |
