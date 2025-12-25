import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== Middleware ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==================== Routes ====================
app.use(routes);

// ==================== Health Check ====================
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'resumelint-backend'
  });
});

// ==================== 404 Handler ====================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'not_found',
    message: 'Endpoint not found'
  });
});

// ==================== Error Handler ====================
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  res.status(500).json({
    error: 'internal_error',
    message: 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`ResumeLint Backend Server`);
  console.log('='.repeat(50));
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
  console.log('\nMock Data Information:');
  console.log('- Mock users available (see src/models/mockData.ts)');
  console.log('- Test login: POST /api/auth/login');
  console.log('  { "provider": "email", "email": "john.doe@example.com", "password": "any" }');
  console.log('='.repeat(50));
});

export default app;
