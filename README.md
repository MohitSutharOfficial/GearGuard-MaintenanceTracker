# GearGuard — The Ultimate Maintenance Tracker

A comprehensive ERP-style maintenance management system built with React and Node.js, following Odoo design principles.

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
# Edit .env with your database credentials

# Setup database
npx prisma generate
npx prisma migrate dev
npm run seed

# Start backend
npm run dev
```

Backend will run on `http://localhost:3000`

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
NEW → IN_PROGRESS → REPAIRED
                 → SCRAP
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

## Domain Documentation

Critical domain knowledge (READ BEFORE CODING):
1. [Domain Scope](docs/domain_scope.md)
2. [Workflows](docs/workflows.md)
3. [Data Models](docs/data_models.md)
4. [UI Specification](docs/ui_spec.md)
5. [Automations](docs/automations.md)
6. [API Contracts](docs/api_contracts.md)

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

## Deployment

### Backend Deployment
- Deploy to: Heroku, Railway, AWS EC2, DigitalOcean
- Set environment variables
- Run migrations: `npx prisma migrate deploy`

### Frontend Deployment
- Deploy to: Vercel, Netlify, AWS S3+CloudFront
- Set `VITE_API_URL` to production API
- Build: `npm run build`

### Environment Variables

**Backend** (`.env`):
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
PORT=3000
CORS_ORIGIN=https://your-frontend.com
```

**Frontend** (`.env`):
```env
VITE_API_URL=https://your-api.com/api/v1
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

**Built with ❤️ using React, Node.js, and Odoo-inspired UX principles**
