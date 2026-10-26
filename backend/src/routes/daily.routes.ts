import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { eventSchema } from '../schemas/zod.schemas';

// Daily outfit router
export const dailyRouter = Router();
dailyRouter.get('/', authMiddleware, (_req: AuthRequest, res: Response) => {
  res.json({
    dailyLook: {
      date: new Date().toISOString().split('T')[0],
      title: "Today's Minimalist Vibe",
      theme: "Soft Parisian Chic",
      weather: "Sunny, 22°C",
      quote: "Fashion is about comfort and feeling good in your skin.",
      items: []
    }
  });
});

// Profile router
export const profileRouter = Router();
export const profiles: Map<string, any> = new Map();

profileRouter.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const profile = profiles.get(req.userId || '') || {
    userId: req.userId,
    styleArchetypes: ['MINIMALIST', 'CHIC'],
    colorPalettes: ['NEUTRALS', 'PASTELS'],
    comfortLevel: 8
  };
  res.json({ profile });
});

profileRouter.put('/', authMiddleware, (req: AuthRequest, res: Response) => {
  profiles.set(req.userId || '', { userId: req.userId, ...req.body, updatedAt: new Date().toISOString() });
  res.json({ message: 'Profile updated', profile: profiles.get(req.userId || '') });
});

// Accessories router
export const accessoriesRouter = Router();
export const accessories: Map<string, any> = new Map();

accessoriesRouter.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const userAcc = Array.from(accessories.values()).filter(a => a.userId === req.userId);
  res.json({ accessories: userAcc });
});

accessoriesRouter.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const id = `acc-${Date.now()}`;
  const newAcc = { id, userId: req.userId, ...req.body, createdAt: new Date().toISOString() };
  accessories.set(id, newAcc);
  res.status(201).json({ accessory: newAcc });
});

// Planner router
export const plannerRouter = Router();
export const events: Map<string, any> = new Map();

plannerRouter.get('/events', authMiddleware, (req: AuthRequest, res: Response) => {
  const userEvents = Array.from(events.values()).filter(e => e.userId === req.userId);
  res.json({ events: userEvents });
});

plannerRouter.post('/events', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const data = eventSchema.parse(req.body);
    const id = `event-${Date.now()}`;
    const newEvent = { id, userId: req.userId, ...data, createdAt: new Date().toISOString() };
    events.set(id, newEvent);
    res.status(201).json({ event: newEvent });
  } catch (err: any) {
    res.status(400).json({ error: true, message: err.message });
  }
});

// Favorites router
export const favoritesRouter = Router();
export const favorites: Map<string, any> = new Map();

favoritesRouter.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const userFavs = Array.from(favorites.values()).filter(f => f.userId === req.userId);
  res.json({ favorites: userFavs });
});

favoritesRouter.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const { outfitId, notes } = req.body;
  const id = `fav-${Date.now()}`;
  const fav = { id, userId: req.userId, outfitId, notes, createdAt: new Date().toISOString() };
  favorites.set(id, fav);
  res.status(201).json({ favorite: fav });
});

favoritesRouter.delete('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  favorites.delete(req.params.id);
  res.json({ message: 'Favorite removed' });
});
