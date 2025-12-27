# GearGuard Frontend

React-based frontend for the GearGuard Maintenance Tracker application.

## Tech Stack

- **Framework**: React 18.2
- **Language**: TypeScript 5.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router 6
- **State Management**: Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Prerequisites

- Node.js 20 or higher
- npm or yarn

## Installation

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Running the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/
│   │   ├── Kanban/
│   │   ├── Calendar/
│   │   └── Equipment/
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Equipment.tsx
│   │   ├── Maintenance.tsx
│   │   ├── Teams.tsx
│   │   ├── Login.tsx
│   │   └── NotFound.tsx
│   ├── context/             # React Context providers
│   │   └── AuthContext.tsx
│   ├── services/            # API service layer
│   │   ├── api.ts           # Axios instance
│   │   ├── auth.ts
│   │   ├── equipment.ts
│   │   ├── requests.ts
│   │   ├── teams.ts
│   │   └── reports.ts
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Root component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Key Features

### Authentication
- JWT-based authentication
- Protected routes
- Auto-redirect on token expiration
- Role-based access control

### Maintenance Request Management
- **Kanban Board**: Drag & drop for corrective maintenance
  - States: New → In Progress → Repaired/Scrap
  - Visual overdue indicators
  - Technician avatars
- **Calendar View**: Preventive maintenance scheduling
  - Click date to create scheduled maintenance
  - Visual timeline of scheduled work

### Equipment Management
- Equipment list with filtering
- Equipment details with maintenance history
- Smart button showing open request count
- Status indicators (Operational, Under Maintenance, Unusable)

### Team Management
- Team workload visualization
- Member assignments
- Performance metrics

### Dashboard
- Real-time statistics
- Overdue alerts
- Equipment utilization
- Compliance metrics

## API Integration

All API calls use the centralized `api.ts` service with:
- Automatic Bearer token injection
- Global error handling
- 401 redirect to login
- Request/response interceptors

### Example Usage

```typescript
import { equipmentService } from '@/services/equipment';

// Get all equipment
const equipment = await equipmentService.getAll();

// Get equipment with filters
const filtered = await equipmentService.getAll({ 
  status: 'OPERATIONAL' 
});

// Create equipment
const newEquipment = await equipmentService.create({
  name: 'Hydraulic Press',
  code: 'HP-001',
  categoryId: 1,
  maintenanceTeamId: 1
});
```

## State Management

Using React Context API for:
- **AuthContext**: User authentication state
  - Current user
  - Login/logout actions
  - Token management

## Routing

```
/                  → Dashboard
/equipment         → Equipment List
/equipment/:id     → Equipment Details
/maintenance       → Maintenance Kanban/Calendar
/teams             → Teams Management
/login             → Login Page
```

Protected routes require authentication.

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Theme**: Professional ERP aesthetic
- **Components**: Odoo-inspired UI patterns

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Lazy loading of routes
- Code splitting with Vite
- Optimized bundle size
- Fast refresh in development

## Building for Production

```bash
# Create production build
npm run build

# Output will be in dist/ folder
# Serve with any static file server
```

## Deployment

The frontend can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

Make sure to set the `VITE_API_URL` environment variable to your production API endpoint.

## Environment-Specific Configuration

### Development
```env
VITE_API_URL=http://localhost:3000/api/v1
```

### Production
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

## Troubleshooting

### API Connection Issues
- Verify backend is running on port 3000
- Check `VITE_API_URL` in `.env`
- Ensure CORS is configured on backend

### Build Errors
- Clear `node_modules` and reinstall
- Check Node.js version (must be 20+)
- Verify all environment variables are set

## License

Proprietary - GearGuard Maintenance Tracker
