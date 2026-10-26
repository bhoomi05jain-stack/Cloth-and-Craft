import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { garments } from './garments.routes';

export const laundryRouter = Router();

// GET /api/laundry - List all items in laundry or need washing
laundryRouter.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const userGarments = Array.from(garments.values()).filter(g => g.userId === req.userId);
  const inLaundry = userGarments.filter(g => ['IN_LAUNDRY', 'DIRTY', 'DRY_CLEANING'].includes(g.status));
  const clean = userGarments.filter(g => g.status === 'CLEAN' || !g.status);
  
  res.json({
    summary: {
      total: userGarments.length,
      cleanCount: clean.length,
      laundryCount: inLaundry.length
    },
    inLaundry,
    clean
  });
});

// POST /api/laundry/update-status - Update status of a garment
laundryRouter.post('/update-status', authMiddleware, (req: AuthRequest, res: Response) => {
  const { garmentId, status } = req.body;
  const validStatuses = ['CLEAN', 'DIRTY', 'IN_LAUNDRY', 'DRY_CLEANING', 'STORED'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: true, message: `Invalid status. Valid: ${validStatuses.join(', ')}` });
  }

  const garment = garments.get(garmentId);
  if (!garment || garment.userId !== req.userId) {
    return res.status(404).json({ error: true, message: 'Garment not found' });
  }

  garment.status = status;
  garment.updatedAt = new Date().toISOString();
  garments.set(garmentId, garment);

  res.json({ garment, message: `Status updated to ${status}` });
});
