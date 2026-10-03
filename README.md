# CampusClutch

A full-stack platform for college students to find teammates, join competitions, and build collaborative teams.

## Overview

Finding teammates for hackathons and projects can be tough. CampusClutch connects students by skills, interests, and goals -- making team formation fast and effective.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| Real-Time | Socket.io |

## Features

- College community -- sign up with any college email
- Skill-based discovery -- filter teams/competitions by tech tags
- Team formation -- create or join teams for hackathons and projects
- Real-time chat -- team messaging with Socket.io
- Seed data -- pre-loaded with 20 students, 6 competitions, 10 teams

## Getting Started

```bash
git clone https://github.com/atharvez/CampusClutch.git
cd CampusClutch

# Backend
cd backend && npm install
# Create backend/.env with MONGODB_URI and JWT_SECRET
npm run dev

# Frontend (new terminal)
cd frontend && npm install
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:5000

## License

MIT (c) Atharva Desai