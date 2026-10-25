import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { optionalAuth } from './middleware/auth.js';
import authRouter from './routes/auth/index.js';
import scoresRouter from './routes/scores.js';
import puzzlesRouter from './routes/puzzles.js';
import notColorBlindRouter from './routes/notColorBlind.js';
import { initDb, checkDbHealth } from './db.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Requests with no origin (e.g., same-origin, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow Vercel deployment preview / production domains and local development
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Decode JWT when present (but never block unauthenticated requests globally)
app.use(optionalAuth);

// ---------------------------------------------------------------------------
// Health check and root inspection
// ---------------------------------------------------------------------------

const healthCheckHandler = async (_req: Request, res: Response) => {
  const dbHealth = await checkDbHealth();
  const statusCode = dbHealth.ok ? 200 : 503;

  res.status(statusCode).json({
    status: dbHealth.ok ? 'ok' : 'degraded',
    database: {
      type: dbHealth.type,
      connected: dbHealth.ok,
      latencyMs: dbHealth.latencyMs,
      ...(dbHealth.error ? { error: dbHealth.error } : {}),
    },
    timestamp: new Date().toISOString(),
  });
};

// Health check mounted on both /api/health and /health for container/Vercel probes
app.get(['/api/health', '/health'], healthCheckHandler);

// Top-level status endpoint
app.get(['/api', '/'], (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'synapse-api' });
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Primary /api routing (used by client and Vercel /api/(.*) rewrites)
app.use('/api/auth', authRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/not-color-blind', notColorBlindRouter);
app.use('/api/puzzles', puzzlesRouter);

// Fallback routing in case incoming requests arrive with /api prefix stripped
app.use('/auth', authRouter);
app.use('/scores', scoresRouter);
app.use('/not-color-blind', notColorBlindRouter);
app.use('/puzzles', puzzlesRouter);

// ---------------------------------------------------------------------------
// 404 catch-all
// ---------------------------------------------------------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected internal server error occurred.',
  });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
(async () => {
  try {
    await initDb();
  } catch (err: unknown) {
    console.warn('⚠️  Database initialization warning:', (err as Error).message);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 GuessTheSize API running on http://localhost:${PORT}`);
    console.log(`   Health:      http://localhost:${PORT}/api/health`);
    console.log(`   Auth:        http://localhost:${PORT}/api/auth/register | /login | /google | /github | /me`);
    console.log(`   Scores:      http://localhost:${PORT}/api/scores | /me | /leaderboard | /not-color-blind`);
    console.log(`   Puzzles:     http://localhost:${PORT}/api/puzzles | /items | /session | /daily\n`);
  });
})();

export default app;
