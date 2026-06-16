# Furute Admin Panel - Technical Documentation

This module provides a secure, fully featured, and production-ready Admin Panel for managing content on the **Furute** website. It is fully isolated from the public website, ensuring zero regression or layout interference.

---

## Technical Stack & Features

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB (via Mongoose)
- **State & Forms**: React Hook Form
- **Authentication**: JWT-based session with secure, HTTP-only Cookies (`admin_token`)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Upload Flow**: Self-contained Client-to-Base64 image conversion, allowing robust deployments on serverless hosts like Vercel with zero external dependencies.

---

## Credentials (Auto-Seeding)

When running the system for the first time, if no administrator user is found in the database, the login API automatically seeds a default credential:

- **Username / Email**: `admin@furute.in`
- **Password**: `admin123`

> [!CAUTION]
> It is highly recommended to change the password immediately on the `/admin/settings` page after logging in for the first time.

---

## Directory Layout

```
app/
└── admin/
    ├── login/                 # Glassmorphic Login Gateway
    ├── dashboard/             # Platform stats & recent timelines
    ├── testimonials/          # CRUD grid with modal uploader
    ├── videos/                # Video links & YouTube embeds
    ├── events/                # Event scheduler CRUD
    ├── programs/              # Course catalogs & brochure attachment
    ├── contacts/              # Public inquiry box & CSV exporter
    ├── speaker-requests/      # Public speaker requests & CSV exporter
    ├── gallery/               # Category uploader supporting WebP
    ├── settings/              # Settings & password manager
    └── layout.tsx             # Responsive shell (Desktop/Mobile sidebar)
```

---

## Security Details

1. **HTTP-only Cookie**: The token cookie `admin_token` is flagged with `HttpOnly`, `Secure` (in production), and `SameSite=Strict`. This makes it completely invisible to client-side scripts, protecting it from Cross-Site Scripting (XSS) attacks.
2. **Protected Routes Middleware**: All routes matching `/admin/:path*` (except `/admin/login`) are protected at the server-edge using Next.js Middleware in `middleware.ts`. Invalid or expired tokens trigger automatic cookie deletion and redirection.
3. **Password Encryption**: Stored passwords are encrypted using `bcryptjs` with a work factor of 10.
