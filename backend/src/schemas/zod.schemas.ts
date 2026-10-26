import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  avatarEmoji: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatarEmoji: z.string().optional(),
  preferences: z.object({
    favoriteColors: z.array(z.string()).optional(),
    colorsToAvoid: z.array(z.string()).optional(),
    preferredStyles: z.array(z.string()).optional(),
    preferredCategories: z.array(z.string()).optional(),
    comfortLevel: z.string().optional(),
    genderNeutral: z.boolean().optional(),
    climateZone: z.string().optional()
  }).optional()
});

export const createGarmentSchema = z.object({
  name: z.string().min(2),
  category: z.string(),
  subcategory: z.string().optional(),
  primaryColor: z.string(),
  colorHex: z.string().optional(),
  pattern: z.string().optional(),
  material: z.string().optional(),
  season: z.array(z.string()).optional(),
  styleTags: z.array(z.string()).optional(),
  occasionTags: z.array(z.string()).optional(),
  laundryStatus: z.enum(['CLEAN', 'WORN', 'IN_LAUNDRY', 'WASHING', 'DRYING', 'READY_TO_WEAR', 'DAMAGED']).optional(),
  imageUrl: z.string().optional()
});

export const generateOutfitSchema = z.object({
  moods: z.array(z.string()).default([]),
  occasion: z.string().default('Casual outing'),
  preferredColors: z.array(z.string()).default([]),
  colorsToAvoid: z.array(z.string()).default([]),
  weather: z.string().optional(),
  temperatureC: z.number().optional(),
  season: z.string().optional(),
  maxRecommendations: z.number().int().min(1).max(12).default(6)
});

export const createEventSchema = z.object({
  title: z.string().min(2),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  occasion: z.string().default('Casual'),
  dressCode: z.string().optional(),
  notes: z.string().optional(),
  location: z.string().optional(),
  outfitId: z.string().optional()
});

export const outfitFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  isVibe: z.boolean(),
  comments: z.string().optional()
});
