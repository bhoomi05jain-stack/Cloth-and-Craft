import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { authRouter } from './routes/auth.routes';
import { profileRouter } from './routes/profile.routes';
import { garmentsRouter } from './routes/garments.routes';
import { laundryRouter } from './routes/laundry.routes';
import { outfitsRouter } from './routes/outfits.routes';
import { dailyRouter } from './routes/daily.routes';
import { accessoriesRouter } from './routes/accessories.routes';
import { plannerRouter } from './routes/planner.routes';
import { favoritesRouter } from './routes/favorites.routes';
import { openApiSpec } from './openapi';

export function createApp() {
  const app = express();
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
  app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'closet-craft-api',
      version: '2.0.0',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/garments', garmentsRouter);
  app.use('/api/laundry', laundryRouter);
  app.use('/api/outfits', outfitsRouter);
  app.use('/api/daily-outfit', dailyRouter);
  app.use('/api/accessories', accessoriesRouter);
  app.use('/api/planner', plannerRouter);
  app.use('/api/favorites', favoritesRouter);

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.statusCode || 500;
    res.status(status).json({ error: true, message: err.message || 'Internal Server Error' });
  });
  return app;
}
