# Event Registration System

A full-stack web application for educational institutions to manage events and student registrations. Faculty create and manage events, coordinators handle registrations, and students browse and register for published events.

## Tech Stack

### Client (Frontend)

| Category      | Technology                              |
| ------------- | --------------------------------------- |
| Framework     | React 19 (Vite 7)                       |
| Styling       | Tailwind CSS 4                          |
| State         | Zustand                                 |
| Data Fetching | TanStack Query (React Query)            |
| Forms         | React Hook Form + Zod                   |
| UI            | Radix UI, Lucide React, Sonner (toasts) |
| HTTP          | Axios                                   |

### Server (Backend)

| Category   | Technology                 |
| ---------- | -------------------------- |
| Runtime    | Node.js                    |
| Framework  | Express 5                  |
| Database   | PostgreSQL (Prisma ORM)    |
| Auth       | JWT (HTTP-only cookies)    |
| Validation | express-validator          |
| Uploads    | Cloudinary + Multer        |
| Security   | Helmet, express-rate-limit |

## Features

### Roles

- **FACULTY** – Create and manage events, assign coordinators
- **STUDENT** – Register for events, view My Tickets
- **ADMIN** – Full access (Faculty + Student features)

### Authentication & Authorization

- Register (STUDENT or FACULTY)
- Login / Logout (JWT with HTTP-only cookies)
- Protected routes with role-based access
- Profile update (name, email, phone, roll number, branch, semester)
- Change password

### Event Management (Faculty)

- Create events with categories (TECH, CULTURAL, SPORTS), posters, dates, fees
- Draft → Publish workflow
- Edit and delete events
- Assign main coordinator + additional coordinators
- **Team events** – min/max team size, team name and members
- **Custom form config** – dynamic fields per event
- **Semester control** – restrict events to students up to a certain semester

### Registration

- **Online** – Students register for published events
- **Manual entry** – Coordinators/faculty add participants (e.g. on-spot)
- Cancel registration
- Participant lists with real-time updates

### Dashboards

- **Faculty Dashboard** – My events, create/edit/delete, publish
- **Coordinator Dashboard** – Events assigned as coordinator
- **Student Dashboard (My Tickets)** – Registered events
- **ManageEvent** – Event details, coordinators, registrations, manual entry

## Project Structure

```
Event-Registration/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/     # ManualEntryModal
│   │   │   ├── events/       # CreateEventModal, EventCard, EventRegistrationModal
│   │   │   ├── shared/       # Navbar, Footer, ScrollToTop
│   │   │   └── ui/           # Button, Card, ConfirmDialog, Dialog, Input, etc.
│   │   ├── hooks/            # useEvents, useDebounce
│   │   ├── lib/              # api, utils
│   │   ├── pages/
│   │   │   ├── Auth/         # Login, Register
│   │   │   ├── Dashboard/    # FacultyDashboard, CoordinatorDashboard, StudentDashboard,
│   │   │   │                 # ManageEvent, EventRegistrations
│   │   │   ├── EventDetails.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Landing.jsx
│   │   │   └── Profile.jsx
│   │   └── store/            # authStore
│   └── vercel.json
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── config/           # db, env
│       ├── controllers/      # authController, eventController, registrationController
│       ├── middleware/       # auth, error, rateLimit, validation
│       ├── routes/           # auth, event, registration, upload
│       ├── utils/            # generateToken
│       └── server.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Cloudinary account (for poster uploads)

### 1. Clone the repository

```bash
git clone <repo-url>
cd Event-Registration
```

### 2. Server setup

```bash
cd server
npm install
```

Create `.env` in `server/` with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/event_registration?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/event_registration"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
PORT=5000

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# For forgot-password emails (Gmail: use app password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

Run migrations and start the server:

```bash
npx prisma migrate dev
npm run dev
```

### 3. Client setup

```bash
cd client
npm install
```

Create `.env` in `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173` (or the port Vite assigns).

## Environment Variables

### Server (`server/.env`)

| Variable       | Required            | Description                                        |
| -------------- | ------------------- | -------------------------------------------------- |
| DATABASE_URL   | Yes                 | PostgreSQL connection string (pooled)              |
| DIRECT_URL     | Yes                 | Direct connection for Prisma migrations            |
| JWT_SECRET     | Yes                 | Secret for signing JWTs                            |
| JWT_EXPIRES_IN | Yes                 | Token expiry (e.g. `7d`)                           |
| CORS_ORIGIN    | Yes                 | Client origin (e.g. `http://localhost:5173`)       |
| PORT           | No                  | Server port (default: 5000)                        |
| CLOUDINARY\_\* | Yes                 | Cloudinary credentials for poster uploads          |
| SMTP_HOST      | For forgot-password | SMTP host (e.g. `smtp.gmail.com`)                  |
| SMTP_PORT      | For forgot-password | SMTP port (default: 587)                           |
| SMTP_USER      | For forgot-password | SMTP auth email                                    |
| SMTP_PASS      | For forgot-password | SMTP password or app password                      |
| FRONTEND_URL   | For forgot-password | Base URL for reset links (defaults to CORS_ORIGIN) |
| APP_NAME       | No                  | App name in emails (default: Event Registration)   |

### Client (`client/.env`)

| Variable     | Required | Description                                     |
| ------------ | -------- | ----------------------------------------------- |
| VITE_API_URL | Yes      | API base URL (e.g. `http://localhost:5000/api`) |

## Roadmap

- [ ] Email notifications (registration confirmation, event updates)
- [ ] Admin panel (user management, system settings)
- [ ] Analytics and reporting (charts, trends)
- [ ] Feedback/ratings for past events
- [ ] Profile avatars
