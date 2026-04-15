# EventNexus - Unified Event Management Platform

EventNexus is a modern, high-performance event management system designed for seamless discovery and professional organization. Built with the MERN stack and styled for a premium user experience using Tailwind CSS and Framer Motion.

## 🚀 Key Features

### 👤 For Attendees
- **Infinite Discovery**: Advanced search and filtering by category, location, and real-time availability.
- **Smart Registration**: One-click registration with dynamic ticket and QR code generation for digital entry.
- **Personal Dashboard**: Manage all your active event passes and track history.
- **Secure Access**: JWT-based authentication for data privacy.

### 🛠️ For Organizers (Admin)
- **Analytics Dashboard**: Real-time stats on platform engagement, user growth and event performance.
- **Event Lifecycle Manager**: Comprehensive CRUD interface with category and seat management.
- **Attendance Control**: Instant visibility into attendee lists and registration metrics.

## 🛠️ Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Framer Motion, Lucide Icons, Axios, React Hot Toast.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT.
- **Utilities**: QRCode, Multer (Image uploads), Bcrypt (Security), UUID (Ticket ID).

---

## 🏗️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas URI)

### 2. Backend Setup
1. Open a terminal in the `backend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random key.
   - `JWT_EXPIRE`: Token duration (e.g., `30d`).
   - `EMAIL_HOST`: SMTP host (e.g., `smtp.gmail.com`).
   - `EMAIL_PORT`: SMTP port (e.g., `587`).
   - `EMAIL_USER`: Your email address.
   - `EMAIL_PASS`: Your email app password.
4. **Seed the database** (Optional but recommended for testing):
   ```bash
   node utils/seed.js
   ```
5. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Open a terminal in the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Architecture

### Backend Structure
- `/models`: Mongoose schemas for Users, Events, and Registrations.
- `/controllers`: Logic for authentication, event discovery, and administrative management.
- `/routes`: Definition of public and protected API endpoints.
- `/middleware`: Authentication guards and role-based authorization engines.

### Frontend Structure
- `/context`: Centralized state management for Authentication.
- `/pages`: High-fidelity, responsive views for Home, Dashboard, Admin, and Event Details.
- `/components`: Reusable UI components powered by Tailwind and Framer Motion.
- `/services`: Axios-integrated API communication layer.

---

## 🔒 Default Credentials (After Seeding)
- **Email**: `admin@nexus.com`
- **Password**: `password123`
- **Role**: Admin

---

## 🛡️ Future Enhancements
- Email automation via Nodemailer.
- Real-time notification system using Socket.io.
- Stripe payment gateway integration for paid events.
- Advanced CSV/Excel attendee data exports.

---
Designed and developed for **Techside-Pragyan/EventNexus**.
