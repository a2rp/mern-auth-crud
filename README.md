# MERN Auth CRUD

A MERN contact manager with account registration, cookie-based sessions, and contact CRUD. Each account can only view and change its own contacts.

## Features

- React client with protected dashboard routes
- Express API with MongoDB and Mongoose
- JWT sessions stored in HttpOnly cookies
- User-scoped contact create, read, update, and delete endpoints
- Server-side input validation, password hashing, CORS allowlisting, and generic auth errors

## Requirements

- Node.js 18 or newer
- MongoDB connection string

## Run locally

1. Configure the API:

   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```

   Set `MONGODB_URI` to your MongoDB connection and replace `TOKEN_KEY` with a random secret of at least 32 bytes. Install and start the API:

   ```powershell
   npm install
   npm run start:dev
   ```

   The API listens on `http://localhost:1198` by default.

2. In another terminal, configure and start the client:

   ```powershell
   cd frontend
   Copy-Item .env.example .env
   npm install
   npm start
   ```

   The client runs at `http://localhost:3000` and calls the API at `REACT_APP_API_URL`.

## Configuration

| Variable | Service | Purpose |
| --- | --- | --- |
| `PORT` | API | Listening port (default `1198`) |
| `MONGODB_URI` | API | MongoDB connection string |
| `TOKEN_KEY` | API | JWT signing secret, at least 32 bytes |
| `CLIENT_ORIGIN` | API | Comma-separated allowlist of client origins |
| `COOKIE_SAME_SITE` | API | `strict` by default; set `none` for cross-site HTTPS deployments |
| `REACT_APP_API_URL` | Client | API origin (default `http://localhost:1198`) |

For production, use HTTPS and set exact trusted frontend origins in `CLIENT_ORIGIN`. `COOKIE_SAME_SITE=none` requires HTTPS and is intended only for cross-site deployments.

## API routes

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/user/register` | Public | Create an account and start a session |
| `POST` | `/api/user/login` | Public | Start a session |
| `POST` | `/api/user` | Session | Verify the current session |
| `POST` | `/api/user/logout` | Public | Clear the session cookie |
| `GET` | `/api/contact` | Session | List the signed-in user's contacts |
| `POST` | `/api/contact` | Session | Create a contact |
| `PATCH` | `/api/contact` | Session | Update one of the signed-in user's contacts |
| `DELETE` | `/api/contact` | Session | Delete one of the signed-in user's contacts |

Authenticated routes require the HttpOnly `token` cookie. The client sends requests with credentials enabled.

## Project layout

- `frontend/` — Create React App client
- `backend/` — Express API and MongoDB models
