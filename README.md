## Fullstack App (React + Express + Prisma + PostgreSQL)

Production-ready full-stack codebase with a React (Vite + TypeScript + Tailwind) frontend and an Express (TypeScript) backend using Prisma ORM with PostgreSQL, JWT auth with refresh tokens (httpOnly cookies), input validation (Zod), security middleware, and Docker Compose.

### Quickstart (Docker)

1. Copy environment templates and set secrets:
   - Copy `.env.example` to `.env`
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`

2. Start services:
   ```bash
   docker compose up --build
   ```

3. App URLs:
   - Backend API: http://localhost:4000
   - Frontend: http://localhost:5173

4. Run database migrations (first time):
   ```bash
   docker compose exec backend npm run prisma:migrate
   docker compose exec backend npm run prisma:generate
   ```

### Local Development (no Docker)

1. Start PostgreSQL locally and set `backend/.env` `DATABASE_URL` accordingly.
2. Backend:
   ```bash
   cd backend
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```
3. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Tech stack

- Frontend: React 18, Vite, TypeScript, TailwindCSS, React Router, Zustand, Axios
- Backend: Express, TypeScript, Prisma, PostgreSQL, Zod, JWT (access + refresh), bcrypt, cookie-parser
- Security: Helmet, CORS, Rate limiting, input validation
- DX: ESLint-ready TypeScript configs, structured project layout
- Docker: Backend + DB + Frontend via Compose

### Auth Flow

- Login returns an access token (short-lived) in JSON and sets a refresh token as httpOnly cookie.
- API requests send `Authorization: Bearer <accessToken>`.
- On 401, the frontend attempts a silent refresh against `/api/auth/refresh` (cookie-based) to get a new access token and retries.

### Project layout

```

backend/   # Express API + Prisma
frontend/  # React + Vite app
```
### Demo Screenshot 
<img width="1280" height="576" alt="image" src="https://github.com/user-attachments/assets/5c329bc3-1f67-48dc-9ae9-dc88af01afac" />
<img width="1280" height="578" alt="image" src="https://github.com/user-attachments/assets/6cc89aa9-b711-46f4-b45b-40452c026d31" />
<img width="1280" height="580" alt="image" src="https://github.com/user-attachments/assets/e4498e68-bedc-45a5-a3e9-cd52dde88b25" />
<img width="1280" height="588" alt="image" src="https://github.com/user-attachments/assets/3f4d940a-595e-4457-bc5f-16096ad38e0c" />




