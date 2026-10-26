import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { garmentSchema } from '../schemas/zod.schemas';

export const garmentsRouter = Router();

// In-memory garments collection
export const garments: Map<string, any> = new Map();

// GET /api/garments - List user's garments
garmentsRouter.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const userGarments = Array.from(garments.values()).filter(g => g.userId === req.userId);
  res.json({ garments: userGarments });
});

// GET /api/garments/:id - Garment details
garmentsRouter.get('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const garment = garments.get(req.params.id);
  if (!garment || garment.userId !== req.userId) {
    return res.status(404).json({ error: true, message: 'Garment not found' });
  }
  res.json({ garment });
});

// POST /api/garments - Add garment
garmentsRouter.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const data = garmentSchema.parse(req.body);
    const id = `garment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newGarment = {
      id,
      userId: req.userId,
      ...data,
      timesWorn: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    garments.set(id, newGarment);
    res.status(201).json({ garment: newGarment });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: true, message: 'Validation failed', details: err.errors });
    }
    res.status(500).json({ error: true, message: err.message });
  }
});

// PUT /api/garments/:id - Update garment
garmentsRouter.put('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = garments.get(req.params.id);
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: true, message: 'Garment not found' });
  }
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    userId: existing.userId,
    updatedAt: new Date().toISOString()
  };
  garments.set(existing.id, updated);
  res.json({ garment: updated });
});

// DELETE /api/garments/:id - Delete garment
garmentsRouter.delete('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = garments.get(req.params.id);
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: true, message: 'Garment not found' });
  }
  garments.delete(req.params.id);
  res.json({ message: 'Garment deleted successfully' });
});
