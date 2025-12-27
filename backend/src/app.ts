import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import equipmentRoutes from './routes/equipment.routes';
import maintenanceRequestRoutes from './routes/maintenance-request.routes';
import maintenanceTeamRoutes from './routes/maintenance-team.routes';

// Load environment variables
dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'GearGuard API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
const apiVersion = process.env.API_VERSION || 'v1';

// Register routes
app.use(`/api/${apiVersion}/equipment`, equipmentRoutes);
app.use(`/api/${apiVersion}/maintenance-requests`, maintenanceRequestRoutes);
app.use(`/api/${apiVersion}/maintenance-teams`, maintenanceTeamRoutes);

// Test endpoint
app.get(`/api/${apiVersion}/test`, (_req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

export default app;
