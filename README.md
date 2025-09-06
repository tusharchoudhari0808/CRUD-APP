# CRUD-APP (feature/typescript/crud-app)

> Full-stack CRUD example: **Vue 3 + TypeScript (frontend)** and **Express + TypeScript + PostgreSQL (backend)**. This README explains how to run the project locally, database setup, API endpoints and common troubleshooting tips.

---

## Table of Contents

* 📦 [Tech Stack](#tech-stack)
* 📂 [Repository Structure](#repository-structure)
* ✅ [Prerequisites](#prerequisites)
* 🔑 [Environment variables](#environment-variables)
* 🗄️ [Database (Postgres) setup](#database-postgres-setup)
* ⚙️ [Backend — Install & Run](#backend--install--run)
* 🎨 [Frontend — Install & Run](#frontend--install--run)
* 🔗 [API Endpoints](#api-endpoints)
* 📋 [Data model](#data-model)
* 🛡️ [Validation rules](#validation-rules)
* 📝 [Scripts & Common commands](#scripts--common-commands)
* 🐛 [Troubleshooting](#troubleshooting)
* 🤝 [Contributing](#contributing)
* 📬 [Contact](#contact)

---

## Tech Stack

* 🎨 Frontend: Vue 3, TypeScript, Vite, Vue Router, Axios, Tailwind CSS
* ⚙️ Backend: Node.js, Express, TypeScript, `pg` (node-postgres)
* 🗄️ Database: PostgreSQL

---

## Repository Structure (important folders)

```
/                       # repo root
├─ Backend/              # Express + TypeScript API
│  ├─ src/
│  ├─ config/            # db connection (pg pool)
│  ├─ controllers/       # user controllers (create, read, update, delete, paginate)
│  └─ utils/             # response helpers, etc.
├─ crud-app/             # Vue 3 + TypeScript frontend (Vite)
│  ├─ src/
│  ├─ components/
│  └─ ...
└─ .vscode/
```

---

## Prerequisites

* 📌 Node.js (recommended v18+)
* 📌 npm or yarn
* 📌 PostgreSQL running locally or accessible remotely
* 📌 Git

---

## Environment variables

Create a `.env` file for the Backend (example `.env.example` in `Backend/` if present). Example values:

```env
# Backend/.env
PORT=3000
PGHOST=localhost
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=your_db_name
PGPORT=5432
# optional: DATABASE_URL=postgres://user:pass@host:5432/dbname
```

For the frontend (`crud-app`), create a `.env` or `env.local` with the API base URL (Vite-prefixed):

```env
# crud-app/.env
VITE_API_URL=http://localhost:3000/api
```

> Adjust names if your project uses different env keys.

---

## Database (Postgres) setup

Run the following SQL to create the `users` table used by the backend:

```sql
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

* 📱 `mobile_number` is stored as a string (VARCHAR) to preserve leading zeros and allow country codes.
* 🔢 If you prefer numeric-only storage, you can use `BIGINT` but validate length and formatting on the app side.

---

## Backend — Install & Run

Open a terminal and start the backend server:

```bash
# from repo root
cd Backend
npm install
# development (watch + ts-node-dev or nodemon - check package.json scripts)
npm run dev
# OR build & run
npm run build
npm start
```

**Notes:**

* ⚠️ If `npm run dev` fails with `'ts-node' is not recognized` or similar, install `ts-node` and `ts-node-dev` globally or as devDependencies: `npm i -D ts-node ts-node-dev typescript`.
* 🗄️ Ensure your `.env` values are correct and Postgres is running.

---

## Frontend — Install & Run

Open a second terminal for the frontend:

```bash
cd crud-app
npm install
# development
npm run dev
# build for production
npm run build
```

The frontend expects the backend API base URL in `VITE_API_URL` (see Environment variables above). The dev server typically runs at `http://localhost:5173` (Vite default).

---

## API Endpoints

(The backend controllers expose standard CRUD and pagination endpoints.)

* 📖 `GET /api/users` — Get all users (or paginated when query params provided)
* 📖 `GET /api/users/:id` — Get a single user by `user_id`
* ➕ `POST /api/users` — Create a new user

  * Body: `{ first_name, last_name, dob (YYYY-MM-DD), mobile_number, address }`
* ✏️ `PUT /api/users/:id` — Update a user
* ❌ `DELETE /api/users/:id` — Delete a user
* 🔍 `GET /api/users?page=1&limit=10&first_name=John&sortKey=first_name&order=ASC` — Paginate / search / sort results

Example (curl):

```bash
# create
curl -X POST $VITE_API_URL/users -H "Content-Type: application/json" -d '{"first_name":"John","last_name":"Doe","dob":"1990-01-01","mobile_number":"9876543210","address":"Mumbai"}'

# fetch page 2
curl "$VITE_API_URL/users?page=2&limit=10"
```

---

## Data model (User)

```ts
interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  dob: string; // ISO date (YYYY-MM-DD)
  mobile_number: string;
  address?: string;
}
```

---

## Validation rules (frontend & backend)

* 📝 **First/Last name**: letters and spaces only (`/^[A-Za-z\s]+$/`) — frontend validation implemented in forms.
* 📱 **Mobile number**: digits only, 10-digit validation on frontend; backend should also validate and sanitize input.
* 📅 **DOB**: must be a valid date (YYYY-MM-DD).

Use a validation library for stronger guarantees: `Yup`, `VeeValidate` (Vue) or `zod` (backend + frontend).

