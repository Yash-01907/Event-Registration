# Event Registration System

A full-stack web application designed for educational institutions to streamline the process of event management and student registration. This system allows faculty members to organize events and students to participate seamlessly.

## 🚀 Tech Stack

### Client (Frontend)

- **Framework:** React 19 (Vite)
- **Styling:** TailwindCSS 4
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod Validation
- **UI Components:** Radix UI, Lucide React

### Server (Backend)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JSON Web Tokens (JWT) with HTTP-only cookies
- **File Uploads:** Cloudinary + Multer

## ✅ Work Done (Features Implemented)

### Authentication & Authorization

- **User Roles:** Supports `FACULTY` and `STUDENT` roles.
- **Secure Auth:** Bcrypt password hashing and JWT-based session management.
- **Protected Routes:** Role-based access control for dashboards and management pages.

### Event Management (Faculty)

- **Create & Edit:** Faculty can create events with details like categories, posters, dates, and fees.
- **Publish Workflow:** Events can be drafted and published when ready.
- **Coordinator Management:** Faculty can assign other users (students or faculty) as coordinators for specific events.
- **Dashboard:** Dedicated view to manage created events.

### Registration System

- **Online Registration:** Students can browse and register for published events.
- **Manual Entry:** Coordinators and Faculty can manually register participants (e.g., for on-spot registrations).
- **Ticket Management:** Students can view their registered events ("My Tickets").
- **Participant Lists:** Coordinators can view real-time registration lists for their events.

### UI/UX

- **Responsive Design:** Mobile-first approach using TailwindCSS.
- **Interactive UI:** Modals for forms, toast notifications (Sonner), and loaders.
- **Landing Page:** Engaging home page to showcase current events.

## 📂 Project Structure

```
root/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI & Feature components
│   │   ├── hooks/          # Custom hooks (useEvents, useDebounce)
│   │   ├── pages/          # Route pages (Auth, Dashboard, Landing)
│   │   ├── store/          # Global state (authStore)
│   │   └── lib/            # Utilities & API configuration
│   └── ...
├── server/                 # Express Backend
│   ├── prisma/             # Database schema & migrations
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & Validation middleware
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helper functions
│   └── ...
└── README.md
```

## 🔮 Future Steps & Roadmap

- [ ] **Email Notifications:** automated emails for registration confirmation and event updates.
- [ ] **Admin Panel:** A Super-Admin role to oversee all users and system settings.
- [ ] **Analytics & Reporting:** Visual charts for registration trends and revenue.
- [ ] **Feedback System:** Allow students to rate and review past events.
- [ ] **Profile Management:** Allow users to update their profile details and avatars.

## 🛠️ Getting Started

1.  **Clone the repository.**
2.  **Setup Server:**
    ```bash
    cd server
    npm install
    npx prisma migrate dev
    npm run dev
    ```
3.  **Setup Client:**
    ```bash
    cd client
    npm install
    npm run dev
    ```
