# CampusClutch - College Team Formation Platform

A premium full-stack web application designed for students to find teammates, join competitions, and build a collaborative academic community.

## Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Lucide Icons, Socket.io-client
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Socket.io
- **Design**: "Academic Curator" System (Custom UI)

## Features
- **Open College Community**: Signup with any college email.
- **Skill-Based Discovery**: Search and filter teams/competitions by tags.
- **Team Formation**: Create or join teams for Hackathons, Projects, and Competitions.
- **Real-Time Integration**: Team chat and notifications (Socket.io).
- **Synthetic Data**: Pre-seeded with 20 students, 6 competitions, and 10 teams.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a cloud instance)

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed  # To populate the DB with synthetic data
npm run dev   # Starts server on http://localhost:5000
```
*Note: Create a `.env` file in the `backend` folder with `MONGO_URI`, `JWT_SECRET`, and `PORT`.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Starts Next.js on http://localhost:3000
```

## UI/UX Highlights
- **Glassmorphism Navigation**: Floating headers with backdrop blur.
- **Tonal Layering**: Depth created by color shifts rather than heavy shadows.
- **Asymmetrical Layout**: Modern academic feel.
