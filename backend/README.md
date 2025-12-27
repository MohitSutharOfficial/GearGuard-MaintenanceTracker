# GearGuard Backend API

Express.js REST API for the GearGuard Maintenance Tracker application.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 15
- **ORM**: Prisma 5.7
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **Logging**: Winston
- **Task Scheduling**: node-cron

## Prerequisites

- Node.js 20 or higher
- PostgreSQL 15 or higher
- npm or yarn

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gearguard"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Bcrypt
BCRYPT_ROUNDS=10
```

## Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with test data
npm run seed
```

## Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

## Test Credentials

After seeding, you can login with:

- **Admin**: admin@gearguard.com / password123
- **Manager**: manager@gearguard.com / password123
- **Technicians**: technician1@gearguard.com, technician2@gearguard.com, technician3@gearguard.com / password123

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/register` - Register new user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Equipment

- `GET /api/v1/equipment` - List all equipment (filters: categoryId, teamId, status)
- `GET /api/v1/equipment/:id` - Get equipment details
- `GET /api/v1/equipment/:id/requests` - Get equipment maintenance requests
- `POST /api/v1/equipment` - Create equipment (ADMIN/MANAGER)
- `PATCH /api/v1/equipment/:id` - Update equipment (ADMIN/MANAGER)
- `DELETE /api/v1/equipment/:id` - Delete equipment (ADMIN)

### Maintenance Requests

- `GET /api/v1/requests` - List all requests (filters: type, stage, equipmentId, technicianId, teamId)
- `GET /api/v1/requests/overdue` - List overdue requests
- `GET /api/v1/requests/:id` - Get request details
- `POST /api/v1/requests` - Create request
- `PATCH /api/v1/requests/:id` - Update request
- `PATCH /api/v1/requests/:id/stage` - Update request stage (workflow transition)
- `DELETE /api/v1/requests/:id` - Delete request (ADMIN/MANAGER)

### Teams

- `GET /api/v1/teams` - List all teams
- `GET /api/v1/teams/:id` - Get team details
- `GET /api/v1/teams/:id/workload` - Get team workload
- `POST /api/v1/teams` - Create team (ADMIN/MANAGER)
- `PATCH /api/v1/teams/:id` - Update team (ADMIN/MANAGER)
- `DELETE /api/v1/teams/:id` - Delete team (ADMIN)

### Users

- `GET /api/v1/users` - List all users (ADMIN/MANAGER)
- `GET /api/v1/users/:id` - Get user details
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (ADMIN)

### Reports

- `GET /api/v1/reports/dashboard` - Dashboard statistics
- `GET /api/v1/reports/utilization` - Equipment utilization
- `GET /api/v1/reports/performance` - Team performance
- `GET /api/v1/reports/compliance` - Preventive maintenance compliance

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding
├── src/
│   ├── config/             # Configuration files
│   │   ├── app.ts
│   │   ├── auth.ts
│   │   └── database.ts
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   ├── notFound.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   │   ├── dateUtils.ts
│   │   ├── encryption.ts
│   │   ├── jwt.ts
│   │   └── logger.ts
│   ├── validators/         # Joi schemas
│   ├── types/              # TypeScript types
│   ├── jobs/               # Cron jobs
│   │   ├── overdue-check.job.ts
│   │   ├── preventive-generator.job.ts
│   │   └── index.ts
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── package.json
├── tsconfig.json
└── nodemon.json
```

## Workflow Rules

### Maintenance Request Stages

- **NEW** → **IN_PROGRESS** → **REPAIRED** or **SCRAP**
- Duration is required before moving to REPAIRED
- Moving to SCRAP flags equipment as UNUSABLE

### Request Types

- **CORRECTIVE**: Breakdown/reactive maintenance (appears in Kanban)
- **PREVENTIVE**: Routine/scheduled maintenance (appears in Calendar, requires scheduledDate)

### Authorization

- **ADMIN**: Full access
- **MANAGER**: Create/update equipment, teams, requests
- **TECHNICIAN**: View and update assigned requests

## Scheduled Jobs

### Overdue Check Job
- **Schedule**: Daily at midnight
- **Action**: Identifies and logs overdue maintenance requests

### Preventive Maintenance Generator
- **Schedule**: Weekly on Monday at 8 AM
- **Action**: Auto-generates preventive maintenance requests for operational equipment

## Development Commands

```bash
# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# View database
npx prisma studio

# Reset database
npx prisma migrate reset
```

## Error Handling

All errors return standardized JSON:

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

## Logging

- **Console**: Development mode
- **Files**: Production mode (error.log, all.log)
- **Format**: Timestamp, level, message, metadata

## Security Features

- JWT authentication with Bearer tokens
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Request rate limiting
- Input validation with Joi
- SQL injection prevention (Prisma ORM)

## License

Proprietary - GearGuard Maintenance Tracker
