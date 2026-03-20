# Venue Booking Backend

Express + PostgreSQL backend for the Venue Booking project.

## Local Setup

1. Install dependencies:
	- `npm install`
2. Create environment file:
	- copy `.env.example` to `.env`
3. Configure PostgreSQL via either:
	- `DATABASE_URL` (recommended), or
	- `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`
4. Start server:
	- `npm run dev`

## Default API Base URL

- `http://localhost:5000/api`

## Health Check

- `GET /health`

## Main Endpoints

- Auth: `/api/auth`
- Spaces: `/api/spaces`
- Bookings: `/api/bookings`
- Users: `/api/users`

## Railway Deployment

This repository includes a root [railway.json](../railway.json) that builds and starts the backend from the monorepo layout.

Required Railway environment variables:

- `DATABASE_URL` (from Railway PostgreSQL service)
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (optional, defaults to `7d`)
- `CORS_ORIGIN` (single URL or comma-separated list)

Example `CORS_ORIGIN`:

- `https://your-frontend.vercel.app`
- `https://your-frontend.vercel.app,https://your-app.up.railway.app`
