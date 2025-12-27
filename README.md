# GearGuard — The Ultimate Maintenance Tracker
[▶️ **Watch Demo Video**](https://drive.google.com/drive/folders/1FsB9oJGWohWyksX_c2O68Hke4gXJDTRu?usp=drive_link)

## Screenshots

![Screenshot 2025-12-28 103624.png](Screenshots/Screenshot%202025-12-28%20103624.png)
![Screenshot 2025-12-28 103637.png](Screenshots/Screenshot%202025-12-28%20103637.png)
![Screenshot 2025-12-28 103654.png](Screenshots/Screenshot%202025-12-28%20103654.png)
![Screenshot 2025-12-28 103914.png](Screenshots/Screenshot%202025-12-28%20103914.png)
![Screenshot 2025-12-28 103935.png](Screenshots/Screenshot%202025-12-28%20103935.png)
![Screenshot 2025-12-28 103947.png](Screenshots/Screenshot%202025-12-28%20103947.png)
![Screenshot 2025-12-28 103957.png](Screenshots/Screenshot%202025-12-28%20103957.png)
![Screenshot 2025-12-28 104008.png](Screenshots/Screenshot%202025-12-28%20104008.png)
![Screenshot 2025-12-28 104016.png](Screenshots/Screenshot%202025-12-28%20104016.png)
![Screenshot 2025-12-28 104028.png](Screenshots/Screenshot%202025-12-28%20104028.png)
![Screenshot 2025-12-28 104037.png](Screenshots/Screenshot%202025-12-28%20104037.png)
![Screenshot 2025-12-28 104052.png](Screenshots/Screenshot%202025-12-28%20104052.png)
![Screenshot 2025-12-28 104103.png](Screenshots/Screenshot%202025-12-28%20104103.png)
![Screenshot 2025-12-28 104121.png](Screenshots/Screenshot%202025-12-28%20104121.png)
![Screenshot 2025-12-28 104133.png](Screenshots/Screenshot%202025-12-28%20104133.png)
![Screenshot 2025-12-28 104157.png](Screenshots/Screenshot%202025-12-28%20104157.png)
![Screenshot 2025-12-28 104229.png](Screenshots/Screenshot%202025-12-28%20104229.png)
![Screenshot 2025-12-28 104240.png](Screenshots/Screenshot%202025-12-28%20104240.png)
![Screenshot 2025-12-28 104257.png](Screenshots/Screenshot%202025-12-28%20104257.png)
![Screenshot 2025-12-28 104313.png](Screenshots/Screenshot%202025-12-28%20104313.png)
![Screenshot 2025-12-28 104324.png](Screenshots/Screenshot%202025-12-28%20104324.png)
![Screenshot 2025-12-28 104333.png](Screenshots/Screenshot%202025-12-28%20104333.png)
![Screenshot 2025-12-28 104341.png](Screenshots/Screenshot%202025-12-28%20104341.png)


**Built with ❤️ using React, Node.js, and Odoo-inspired UX principles**
# GearGuard — The Ultimate Maintenance Tracker

A comprehensive ERP-style maintenance management system built with React and Node.js, inspired by Odoo design principles.

## Project Overview

GearGuard is a full-stack maintenance tracker designed for managing equipment, maintenance requests, and maintenance teams with Kanban boards, calendar views, and automated workflows.

## Architecture

This is a **monorepo** containing two independent applications:

```
ORCHESTRATOR/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + Prisma + PostgreSQL
├── docs/              # Domain documentation
└── .github/           # GitHub Copilot instructions
```

### Frontend
- **Framework**: React 18.2 with TypeScript
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router 6
- **State**: Context API
- **Port**: 5173 (development)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 15
- **ORM**: Prisma 5.7
- **Auth**: JWT + bcrypt
- **Port**: 3000 (default)

## Features

## Quick Start

### Prerequisites
- Node.js 20 or higher
- PostgreSQL 15 or higher
- npm or yarn

### 1. Backend Setup
```bash
cd backend
# Install dependencies
npm install
# Configure environment
cp .env.example .env
# Set up database
npx prisma migrate dev --name init
# Seed database with test data
npm run seed
# Start backend
npm run dev

```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 3. Login

Use these test credentials after seeding:
- **Admin**: admin@gearguard.com / password123
- **Manager**: manager@gearguard.com / password123
- **Technician**: technician1@gearguard.com / password123

## Key Features

### 🎯 Maintenance Request Management
- **Corrective Maintenance**: Reactive breakdown handling via Kanban board
- **Preventive Maintenance**: Scheduled routine maintenance via Calendar view
- **Workflow States**: NEW → IN_PROGRESS → REPAIRED/SCRAP
- **Drag & Drop**: Visual state transitions
- **Overdue Tracking**: Automatic identification of delayed requests

### 🛠️ Equipment Management
- Equipment catalog with categories
- Maintenance history per equipment
- Smart buttons showing open request counts
- Status tracking (Operational, Under Maintenance, Unusable)
- Auto-fill maintenance team from equipment

### 👥 Team Management
- Maintenance teams with members
- Workload distribution
- Team performance metrics
- Role-based assignments

### 📊 Reporting & Analytics
- Dashboard with KPIs
- Equipment utilization reports
- Team performance analysis
- Preventive maintenance compliance

### 🤖 Automation
- **Overdue Check Job**: Daily monitoring (midnight)
- **Preventive Generator Job**: Weekly scheduling (Monday 8 AM)
- Auto-flagging of unusable equipment on SCRAP
- Workflow validation

### 🔒 Security
- JWT authentication
- Role-based access control (ADMIN, MANAGER, TECHNICIAN)
- Password hashing with bcrypt
- CORS protection
- Input validation

## Domain Rules

### Request Types
1. **Corrective** (Breakdown)
   - Appears in Kanban board
   - Starts in NEW state
   - No scheduled date required

2. **Preventive** (Routine)
   - Appears in Calendar view
   - Requires scheduled date
   - Starts in NEW state

### Workflow State Machine
```
NEW → IN_PROGRESS → REPAIRED → SCRAP
```

**Rules**:
- Duration required before REPAIRED
- Moving to SCRAP flags equipment as UNUSABLE
- No backwards transitions allowed

### Authorization Matrix

| Action | ADMIN | MANAGER | TECHNICIAN |
|--------|-------|---------|------------|
| View all equipment | ✅ | ✅ | ✅ |
| Create equipment | ✅ | ✅ | ❌ |
| Delete equipment | ✅ | ❌ | ❌ |
| Create request | ✅ | ✅ | ✅ |
| Update request | ✅ | ✅ | ✅ (own) |
| Delete request | ✅ | ✅ | ❌ |
| Manage teams | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ |

## API Documentation

Full API documentation available at:
- [Backend README](backend/README.md)
- [API Endpoints](backend/README.md#api-endpoints)


## Project Structure

### Backend
```
backend/
├── prisma/                # Database schema & migrations
├── src/
│   ├── config/           # Configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   ├── validators/       # Input validation
│   ├── types/            # TypeScript types
│   ├── jobs/             # Cron jobs
│   ├── app.ts            # Express setup
│   └── server.ts         # Entry point
└── README.md
```

### Frontend
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── context/          # React Context
│   ├── services/         # API client
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
└── README.md
```

## Development Workflow

### Running Both Applications

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Database Management

```bash
# View database GUI
cd backend
npx prisma studio

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name description
```

### Code Quality

```bash
# Backend
cd backend
npm run lint
npm test

# Frontend
cd frontend
npm run lint
npm run type-check
```



## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check `DATABASE_URL` in backend `.env`
   - Ensure database exists

2. **CORS Error**
   - Verify `CORS_ORIGIN` in backend `.env`
   - Check frontend is running on correct port

3. **Authentication Error**
   - Clear localStorage: `localStorage.clear()`
   - Verify JWT_SECRET matches between environments
   - Check token expiry

4. **Build Errors**
   - Delete `node_modules` and reinstall
   - Verify Node.js version (20+)
   - Check all environment variables

## Technology Decisions

### Why Monorepo?
- Shared domain knowledge
- Coordinated deployments
- Unified version control

### Why Prisma?
- Type-safe database access
- Excellent migration system
- Powerful schema language

### Why Vite?
- Fast development server
- Optimized production builds
- Excellent TypeScript support

### Why Context API (not Redux)?
- Simpler for this scale
- Built-in to React
- Sufficient for auth state

## Contributing

1. Read all docs in `docs/` folder
2. Follow GitHub Copilot instructions in `.github/copilot-instructions.md`
3. Respect domain rules (NO improvisation)
4. No framework changes without approval

## License

Proprietary - GearGuard Maintenance Tracker

## Support

For issues or questions:
1. Check documentation in `docs/`
2. Review README files in `frontend/` and `backend/`
3. Check GitHub issues

---
## Team Mamber

- **[Mohit Suthar](https://github.com/MohitSutharOfficial)** — Backend Development (API, Database, Auth)
- **[Ankit Sharma](https://github.com/Ankit-Sharma-17)** — Frontend Development (UI, Kanban, Calendar)

---

**Built with ❤️ using React, Node.js, and Odoo-inspired UX principles**
