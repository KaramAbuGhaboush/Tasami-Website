import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import blogRoutes from './routes/blog';
import projectRoutes from './routes/projects';
import careerRoutes from './routes/career';
import contactRoutes from './routes/contact';
import testimonialRoutes from './routes/testimonials';
import categoryRoutes from './routes/categories';
import timeEntriesRoutes from './routes/timeEntries';
import employeesRoutes from './routes/employees';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for dashboard)
  message: 'Too many requests from this IP, please try again later.'
});

// Specific rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per windowMs
  message: 'Too many login attempts from this IP, please try again later.',
  skipSuccessfulRequests: true // Don't count successful requests
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T00:00:00.000Z"
 *                 uptime:
 *                   type: number
 *                   example: 3600.123
 */
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Tasami API Documentation'
}));

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test API endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Backend is working!"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T00:00:00.000Z"
 */
// Basic API routes
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/time-entries', timeEntriesRoutes);
app.use('/api/employees', employeesRoutes);


// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`📝 Available endpoints:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/blog/articles`);
  console.log(`   - GET  /api/projects`);
  console.log(`   - GET  /api/career/jobs`);
  console.log(`   - POST /api/contact/messages`);
  console.log(`   - POST /api/time-entries (Employee)`);
  console.log(`   - GET  /api/time-entries (Employee)`);
  console.log(`   - GET  /api/employees (Admin)`);
  console.log(`   - POST /api/employees (Admin)`);
});

export default app;