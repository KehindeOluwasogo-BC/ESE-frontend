# ESE Booking System Frontend

Frontend for the ESE booking system, built with React and Vite.

## Overview

This repository contains the user interface for authentication, profile management, bookings, and admin-facing management screens.

## Frontend Stack

- React 19
- Vite 7
- React Router DOM 7
- CSS
- ESLint

## Project Structure

```text
.
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── instructions.txt
└── README.md
```

## Key UI Features

- Registration, login, and password reset flows
- Protected routes with auth context
- Profile and profile picture upload support
- Booking creation and booking history views
- Admin management and user management screens

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
cd frontend
npm install
```

### Run Dev Server

```bash
npm run dev
```

The app runs at http://localhost:3000.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

Notes:
- All client environment variables must start with `VITE_`.
- Keep secrets out of the frontend; only expose values safe for client-side usage.

## Frontend Deployment Notes

- Build output directory: `frontend/dist`
- Configure your hosting provider for SPA routing so all non-file routes resolve to `index.html`

## Author

Kehinde Oluwasogo  
GitHub: https://github.com/KehindeOluwasogo-BC
