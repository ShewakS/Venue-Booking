# Venue Booking System

A full-stack venue booking platform for academic institutions. It allows users to register/login, request space bookings, view booking calendars, and (for admins) manage spaces, booking approvals, and reports.

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL + Sequelize
- JWT authentication
- bcrypt password hashing
- PDF report generation (pdfkit)

### Frontend
- React 18
- React Router
- Axios
- Context API for auth/data state
- Responsive custom CSS UI

## Current Implemented Features

### Authentication and Access
- User registration and login
- Institutional email validation (`@sece.ac.in`)
- JWT-based auth with persisted session
- Role-based frontend routing with protected pages

### Roles
- `admin`
- `faculty`
- `student`
- `coordinator` (stored in backend enum; frontend coordinator dashboard path is shared with student flow)

### User Registration Status
- New users are created as `active`
- User status logic is active-only in current backend model + DB sync behavior

### Space Management
- Create, update, delete spaces (admin workflow)
- Space attributes:
  - name
  - type
  - capacity
  - imageUrl (optional)
- Space list available to authenticated users

### Booking Management
- Create booking requests
- Booking attributes include:
  - title
  - type (`Seminar`, `Club`, `Workshop`, `Hackathon`, `Training`)
  - spaceId
  - date
  - start/end time
  - participants
  - organizedBy
  - notes
  - requestedBy
  - requestedRole
- Booking statuses:
  - `Pending`
  - `Approved`
  - `Rejected`
- Admin can approve/reject pending bookings
- Final-status guard in workflow (pending is the editable state)

### Booking Validation and Conflict Rules
- Required-field and time-format validation
- Capacity check against selected space
- Same-space time overlap prevention
- Academic override conflict prevention

### Calendar and Availability
- Calendar page with slot-based availability view
- Timetable override support:
  - `academic`
  - `available`
- Mobile + desktop calendar layouts

### Reporting
- Booking report endpoint with totals and scoped data
- PDF download of booking report
- Admin report page in frontend

### Dashboards
- Admin dashboard
  - total spaces
  - total requests
  - pending requests
  - space management panel
  - booking review panel
  - calendar availability section
- Faculty dashboard
  - role-based request counts
  - booking list visibility
- Student dashboard
  - role-based request counts
  - booking list visibility

## Project Structure

```
Venue Booking/
  backend/
    src/
      app.js
      config/
      controllers/
      middlewares/
      models/
      routes/
      services/
      utils/
      validators/
    server.js
    package.json
  frontend/
    src/
      components/
      context/
      pages/
      routes/
      services/
      utils/
      App.css
      App.js
      config.js
    package.json
  railway.json
```

## Backend API Overview

Base URL: `http://localhost:5000/api` (local default)

### Auth
- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`

### Bookings
- `GET /bookings`
- `GET /bookings/report`
- `GET /bookings/report/pdf`
- `GET /bookings/:id`
- `POST /bookings`
- `PATCH /bookings/:id/status`
- `DELETE /bookings/:id`

### Spaces
- `GET /spaces`
- `GET /spaces/:id`
- `POST /spaces`
- `PUT /spaces/:id`
- `DELETE /spaces/:id`

### Users
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`

### Timetable Overrides
- `GET /timetable-overrides`
- `POST /timetable-overrides`
- `DELETE /timetable-overrides/:id`

### Health
- `GET /health`

## Environment Variables

### Backend (`backend/.env`)
- `NODE_ENV`
- `PORT`
- `DATABASE_URL` (recommended for cloud)
- `PG_HOST`
- `PG_PORT`
- `PG_DATABASE`
- `PG_USER`
- `PG_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN` (single origin or comma-separated)

### Frontend (`frontend/.env`)
- `REACT_APP_API_BASE_URL` (optional)

If frontend env var is missing, the app falls back to runtime host-based defaults defined in `frontend/src/config.js`.

## Local Development

### 1) Install dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### 2) Configure env
- Create backend `.env` with DB/JWT/CORS settings.
- (Optional) Create frontend `.env` with `REACT_APP_API_BASE_URL`.

### 3) Start backend
```bash
cd backend
npm run dev
```

### 4) Start frontend
```bash
cd frontend
npm start
```

## Deployment Notes

- Backend is structured for Render-style deployment (`render.json` present).
- Frontend can be deployed to Vercel or any static React host.
- Ensure backend `CORS_ORIGIN` includes frontend production origin(s).
- Ensure frontend API base URL points to deployed backend.

## Current Workflow Summary

1. User registers/logs in.
2. JWT session is established.
3. Role-based route access controls pages.
4. Users browse spaces and create booking requests.
5. Admin reviews pending bookings and updates status.
6. Calendar reflects bookings and overrides.
7. Admin can generate and download reports.

## Important Notes

- New-user approval flow is removed in current implementation.
- Booking approval flow remains active.
- UI uses a top fixed navbar; sidebar is not part of active workflow.
- README reflects implemented behavior only, based on current code state.
