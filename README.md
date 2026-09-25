# 🐾 Pawsome Stay Dog Hotel

A full-stack dog hotel / boarding management system built with **Node.js**, **Express**, **React**, and **PostgreSQL** (via **Prisma ORM**).

---

## Project Structure

```
project dog hotel/
├── client/          # React frontend
├── server/          # Express API backend
│   ├── prisma/      # Prisma schema + seed
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── lib/
│       └── utils/
└── README.md
```

---

## Prerequisites

- Node.js 18+ (you have v24)
- PostgreSQL 14+ running locally (or a cloud instance)
- npm 9+

---

## Quick Start

### 1. Set up PostgreSQL

Create a database:
```sql
CREATE DATABASE doghotel;
```

### 2. Configure environment

Edit `server/.env` and update the `DATABASE_URL`:
```
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/doghotel"
```

Leave the JWT_SECRET as-is for development (change for production).

### 3. Run database migrations & seed

```powershell
# From the server folder:
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
cd "server"
node node_modules\prisma\build\index.js db push
node src/prisma/seed.js
```

This creates all tables and seeds:
- Admin user: `admin@doghotel.com` / `admin123`
- 11 kennels (Small, Standard, Large, Suite)
- 6 services
- 6 facilities

### 4. Start the backend

```powershell
# Terminal 1 – from server/ folder
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
node src/index.js
# Server starts on http://localhost:5000
```

Or with auto-reload (nodemon):
```powershell
node node_modules\nodemon\bin\nodemon.js src/index.js
```

### 5. Start the frontend

```powershell
# Terminal 2 – from client/ folder
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
node node_modules\react-scripts\bin\react-scripts.js start
# Opens http://localhost:3000
```

---

## Pages & Features

### Public Website
| Route | Page |
|-------|------|
| `/` | Home – hero, features, services preview, CTA |
| `/facilities` | Facilities with cards, kennel types & pricing |
| `/services` | All services + pricing table |
| `/contact` | Contact form + info |
| `/booking` | 5-step booking wizard |
| `/booking/confirmation` | Booking confirmed + reference number |

### Admin Portal
| Route | Page |
|-------|------|
| `/admin/login` | Secure login |
| `/admin` | Dashboard – stats, recent bookings |
| `/admin/bookings` | All bookings with search + status filter |
| `/admin/bookings/:id` | Booking detail – status update, kennel assign |
| `/admin/kennels` | Kennel management |
| `/admin/customers` | Customer list |
| `/admin/customers/:id` | Customer history |
| `/admin/calendar` | Monthly calendar view |
| `/admin/messages` | Contact messages inbox |

---

## API Endpoints

### Public
```
POST   /api/bookings              Create booking
GET    /api/bookings/reference/:ref  Get booking by ref number
POST   /api/bookings/estimate     Price estimate
POST   /api/contact               Submit contact message
GET    /api/public/services       List services
GET    /api/public/facilities     List facilities
GET    /api/public/pricing        Get pricing info
```

### Admin (requires Bearer token)
```
POST   /api/auth/login            Admin login
GET    /api/auth/me               Current admin

GET    /api/admin/dashboard       Dashboard stats
GET    /api/admin/bookings        All bookings (paginated, filterable)
GET    /api/admin/bookings/:id    Booking detail
PATCH  /api/admin/bookings/:id/status  Update status
DELETE /api/admin/bookings/:id    Delete booking

GET    /api/admin/kennels         All kennels
POST   /api/admin/kennels         Create kennel
PUT    /api/admin/kennels/:id     Update kennel
DELETE /api/admin/kennels/:id     Delete kennel
GET    /api/admin/kennels/availability  Check availability
POST   /api/admin/kennels/:id/assign    Assign kennel to booking

GET    /api/admin/customers       All customers (paginated)
GET    /api/admin/customers/:id   Customer + booking history

GET    /api/admin/calendar        Calendar events
GET    /api/admin/upcoming/checkins   Upcoming check-ins
GET    /api/admin/upcoming/checkouts  Upcoming check-outs

GET    /api/admin/messages        All contact messages
PATCH  /api/admin/messages/:id/read   Mark read
DELETE /api/admin/messages/:id    Delete message
```

---

## Pricing Logic

```
Total = numberOfNights × numberOfDogs × pricePerDogPerNight
```

Default price: **£45 per dog per night** (configurable via `PRICE_PER_DOG_PER_NIGHT` in `.env`).

---

## Email Confirmation (Optional)

To enable email confirmations, add Gmail SMTP credentials to `server/.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password    # Use a Gmail App Password
EMAIL_FROM=Pawsome Stay <your-email@gmail.com>
```

---

## Default Admin Credentials

```
Email:    admin@doghotel.com
Password: admin123
```

**Change these before going live.**

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router 6, Axios |
| Styling | Pure CSS-in-JS (no external CSS framework) |
| Backend | Node.js, Express 4 |
| ORM | Prisma 5 |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Email | Nodemailer |
| Icons | Lucide React |
| Toasts | React Hot Toast |
