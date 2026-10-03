# CampusClutch ðŸŽ“âš¡

A premium full-stack platform for college students to find teammates, join competitions, and build collaborative teams.

## Overview

Finding teammates for hackathons and projects can be tough. CampusClutch connects students by skills, interests, and goals â€” making team formation fast and effective.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| Real-Time | Socket.io |

## Features

- ðŸ« **College Community** â€” Sign up with any college email
- ðŸ” **Skill-Based Discovery** â€” Filter teams/competitions by tech tags
- ðŸ¤ **Team Formation** â€” Create or join teams for hackathons and projects
- ðŸ’¬ **Real-Time Chat** â€” Team messaging with Socket.io
- ðŸŒ± **Seed Data** â€” Pre-loaded with 20 students, 6 competitions, 10 teams

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

MIT Â© [Atharva Desai](https://github.com/atharvez)