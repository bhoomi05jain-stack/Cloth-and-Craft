import bcrypt from 'bcryptjs';
import { CATALOG } from './catalog';
import { id } from './ids';
import { store } from './store';

export async function seedDemoUser() {
  const existing = store.usersByEmail.get('demo@closetcraft.app');
  if (existing) return store.users.get(existing)!;
  const user = store.newUser({
    email: 'demo@closetcraft.app',
    passwordHash: await bcrypt.hash('password123', 10),
    name: 'Style Muse',
    isVerified: true,
    avatarEmoji: '🧚‍♀️'
  });
  for (const item of CATALOG) {
    const gid = id('gar');
    store.garments.set(gid, {
      id: gid,
      ownerId: user.id,
      ...item,
      wearCount: 4,
      daysInLaundry: item.laundryStatus === 'IN_LAUNDRY' ? 2 : 0,
      createdAt: new Date().toISOString()
    });
  }
  const garments = store.garmentsFor(user.id);
  const byName = (n: string) => garments.find((g) => g.name.includes(n));
  const silk = byName('Silk Cream')!;
  const trousers = byName('Pleated')!;
  const blazer = byName('Ivory Blazer')!;
  const sneakers = byName('Platform Sneakers')!;
  const tote = byName('Tote')!;
  const oid = id('out');
  store.outfits.set(oid, {
    id: oid,
    ownerId: user.id,
    name: 'Ivory Office Capsule',
    occasion: 'Office',
    mood: 'Confident',
    weather: 'Sunny',
    formality: 'Smart',
    matchScore: 96,
    explanation: 'Tailored ivory and beige with a laundry-safe silhouette.',
    stylingTips: ['Add the gold herringbone necklace.', 'Soft low pony.'],
    hairstyleTips: 'Soft low pony',
    itemIds: [
      { garmentId: silk.id, slotType: 'TOP' },
      { garmentId: trousers.id, slotType: 'BOTTOM' },
      { garmentId: blazer.id, slotType: 'OUTERWEAR' },
      { garmentId: sneakers.id, slotType: 'SHOE' },
      { garmentId: tote.id, slotType: 'BAG' }
    ],
    accessoryIds: [],
    createdAt: new Date().toISOString()
  });
  store.favorites.add(store.favKey(user.id, oid));
  const friday = new Date();
  friday.setDate(friday.getDate() + ((5 + 7 - friday.getDay()) % 7 || 7));
  const eid = id('evt');
  store.events.set(eid, {
    id: eid,
    userId: user.id,
    title: 'Client presentation',
    date: friday.toISOString().slice(0, 10),
    startTime: '10:00',
    endTime: '11:30',
    occasion: 'Office',
    dressCode: 'Smart casual',
    notes: 'Ivory capsule',
    outfitId: oid,
    hasConflict: false
  });
  return user;
}
