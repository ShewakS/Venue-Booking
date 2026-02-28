# Venue Booking Backend

Express + MongoDB backend for the Venue Booking project.

## Setup

1. Install dependencies:
	- `npm install`
2. Create environment file:
	- copy `.env.example` to `.env`
3. Ensure MongoDB is running locally (or provide a remote URI in `MONGO_URI`).
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

## Frontend Integration Notes

- Backend CORS is enabled for `CORS_ORIGIN` (default `http://localhost:3000`).
- Frontend files are unchanged as requested.
