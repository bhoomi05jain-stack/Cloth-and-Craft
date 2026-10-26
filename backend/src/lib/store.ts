import { id } from './ids';

export type LaundryStatus = 'CLEAN' | 'WORN' | 'IN_LAUNDRY' | 'WASHING' | 'DRYING' | 'READY_TO_WEAR' | 'DAMAGED';

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  avatarEmoji: string;
  createdAt: string;
  updatedAt: string;
};

export type Preferences = {
  userId: string;
  favoriteColors: string[];
  colorsToAvoid: string[];
  preferredStyles: string[];
  preferredCategories: string[];
  comfortLevel: string;
  genderNeutral: boolean;
  weatherPreferences: string[];
  sizes: Record<string, string>;
};

export type Garment = {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  subcategory?: string;
  primaryColor: string;
  colorHex: string;
  pattern: string;
  material?: string;
  season: string[];
  styleTags: string[];
  occasionTags: string[];
  laundryStatus: LaundryStatus;
  wearCount: number;
  lastWornAt?: string;
  daysInLaundry: number;
  imageUrl?: string;
  isolatedUrl?: string;
  createdAt: string;
};

export type Accessory = {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  color: string;
  material?: string;
  styleTags: string[];
  isOwned: boolean;
  status: LaundryStatus;
  imageUrl?: string;
};

export type Outfit = {
  id: string;
  ownerId: string;
  name: string;
  occasion: string;
  mood?: string;
  weather?: string;
  formality?: string;
  matchScore: number;
  explanation?: string;
  stylingTips: string[];
  hairstyleTips?: string;
  itemIds: { garmentId: string; slotType: string }[];
  accessoryIds: { accessoryId: string; isSuggested: boolean }[];
  createdAt: string;
};

export type Event = {
  id: string;
  userId: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  occasion: string;
  dressCode?: string;
  notes?: string;
  outfitId?: string;
  hasConflict: boolean;
  conflictDetails?: string;
};

type Token = { userId: string; token: string; expiresAt: number };

class MemoryStore {
  users = new Map<string, User>();
  usersByEmail = new Map<string, string>();
  preferences = new Map<string, Preferences>();
  garments = new Map<string, Garment>();
  accessories = new Map<string, Accessory>();
  outfits = new Map<string, Outfit>();
  favorites = new Set<string>();
  feedback: { userId: string; outfitId: string; rating: number; isVibe: boolean; comments?: string }[] = [];
  events = new Map<string, Event>();
  daily = new Map<string, { userId: string; date: string; outfitId: string; refreshedAt: string }>();
  resetTokens: Token[] = [];
  verifyTokens: Token[] = [];
  history: { userId: string; outfitId: string; recommendedAt: string; wasWorn: boolean }[] = [];
  statusHistory: { garmentId: string; previousStatus: LaundryStatus; newStatus: LaundryStatus; changedAt: string; reason?: string }[] = [];

  reset() {
    this.users.clear();
    this.usersByEmail.clear();
    this.preferences.clear();
    this.garments.clear();
    this.accessories.clear();
    this.outfits.clear();
    this.favorites.clear();
    this.feedback = [];
    this.events.clear();
    this.daily.clear();
    this.resetTokens = [];
    this.verifyTokens = [];
    this.history = [];
    this.statusHistory = [];
  }

  favKey(userId: string, outfitId: string) {
    return `${userId}:${outfitId}`;
  }

  garmentsFor(userId: string) {
    return [...this.garments.values()].filter((g) => g.ownerId === userId);
  }

  detectConflicts(userId: string, outfitId?: string) {
    if (!outfitId) return { hasConflict: false as const, conflictDetails: undefined };
    const outfit = this.outfits.get(outfitId);
    if (!outfit || outfit.ownerId !== userId) return { hasConflict: false as const, conflictDetails: undefined };
    const blocked = ['IN_LAUNDRY', 'WASHING', 'DRYING', 'DAMAGED'];
    const dirty = outfit.itemIds
      .map((i) => this.garments.get(i.garmentId))
      .filter((g): g is Garment => !!g && blocked.includes(g.laundryStatus));
    if (!dirty.length) return { hasConflict: false as const, conflictDetails: undefined };
    return {
      hasConflict: true as const,
      conflictDetails: `Laundry conflict: ${dirty.map((d) => d.name).join(', ')} unavailable`
    };
  }

  refreshEventConflicts(userId: string) {
    for (const ev of this.events.values()) {
      if (ev.userId !== userId) continue;
      const c = this.detectConflicts(userId, ev.outfitId);
      ev.hasConflict = c.hasConflict;
      ev.conflictDetails = c.conflictDetails;
    }
  }

  newUser(partial: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'isVerified'> & Partial<User>) {
    const user: User = {
      id: partial.id || id('user'),
      email: partial.email,
      passwordHash: partial.passwordHash,
      name: partial.name,
      role: partial.role || 'USER',
      isVerified: partial.isVerified ?? false,
      avatarEmoji: partial.avatarEmoji || '🧚‍♀️',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(user.id, user);
    this.usersByEmail.set(user.email.toLowerCase(), user.id);
    this.preferences.set(user.id, {
      userId: user.id,
      favoriteColors: ['Cream', 'Ivory', 'Sage'],
      colorsToAvoid: [],
      preferredStyles: ['Clean & Minimal'],
      preferredCategories: ['tops', 'bottoms'],
      comfortLevel: 'Regular',
      genderNeutral: false,
      weatherPreferences: ['Temperate'],
      sizes: { top: 'M', bottom: 'M', shoe: '8' }
    });
    return user;
  }
}

export const store = new MemoryStore();
export function resetStore() {
  store.reset();
}
