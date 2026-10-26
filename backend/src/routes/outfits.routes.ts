import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { outfitGenerateSchema, outfitFeedbackSchema } from '../schemas/zod.schemas';
import { garments } from './garments.routes';

export const outfitsRouter = Router();

// In-memory outfits & feedback
export const outfits: Map<string, any> = new Map();
export const feedbacks: Map<string, any> = new Map();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// POST /api/outfits/generate - Generate outfit recommendations
outfitsRouter.post('/generate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const data = outfitGenerateSchema.parse(req.body);
    const userGarments = Array.from(garments.values()).filter(g => g.userId === req.userId);

    // Forward to ML Service or fallback to heuristic pairing
    try {
      const response = await fetch(`${ML_SERVICE_URL}/recommend-outfits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: req.userId,
          mood: data.mood,
          occasion: data.occasion,
          weather: data.weather,
          color_palette_preference: data.colorPalettePreference,
          wardrobe_items: userGarments
        })
      });

      if (response.ok) {
        const result = await response.json();
        return res.json(result);
      }
    } catch (mlErr) {
      console.warn('ML Service unreachable or returned error, using fallback pairing engine');
    }

    // Heuristic Fallback
    const available = userGarments.filter(g => g.status === 'CLEAN' || !g.status);
    const tops = available.filter(g => ['TOPS', 'T_SHIRTS', 'SHIRTS'].includes(g.category));
    const bottoms = available.filter(g => ['JEANS', 'PANTS', 'SKIRTS'].includes(g.category));
    const shoes = available.filter(g => ['SNEAKERS', 'FLATS', 'HEELS', 'BOOTS', 'SANDALS'].includes(g.category));

    const outfitId = `outfit-${Date.now()}`;
    const selectedTop = tops[0] || null;
    const selectedBottom = bottoms[0] || null;
    const selectedShoes = shoes[0] || null;

    const fallbackOutfit = {
      id: outfitId,
      name: `${data.mood || 'Chic'} ${data.occasion || 'Everyday'} Look`,
      totalScore: 0.88,
      items: [selectedTop, selectedBottom, selectedShoes].filter(Boolean),
      reasoning: 'Curated based on complimentary tones and comfort.',
      stylingTips: ['Layer with a light trench or jacket.', 'Add minimal gold or silver accents.']
    };

    outfits.set(outfitId, fallbackOutfit);
    res.json({ outfits: [fallbackOutfit] });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: true, message: 'Validation failed', details: err.errors });
    }
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/outfits/feedback - Submit rating/feedback
outfitsRouter.post('/feedback', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const data = outfitFeedbackSchema.parse(req.body);
    const feedbackId = `fb-${Date.now()}`;
    feedbacks.set(feedbackId, { id: feedbackId, userId: req.userId, ...data, createdAt: new Date().toISOString() });
    res.json({ message: 'Thank you for your feedback!' });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: true, message: 'Validation failed', details: err.errors });
    }
    res.status(500).json({ error: true, message: err.message });
  }
});
