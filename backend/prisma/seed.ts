import { PrismaClient, LaundryStatus, SlotType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CATALOG } from '../src/lib/catalog';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@closetcraft.app' },
    update: {},
    create: {
      email: 'demo@closetcraft.app',
      passwordHash,
      name: 'Style Muse',
      isVerified: true,
      preferences: {
        create: {
          favoriteColors: ['Cream', 'Ivory', 'Sage'],
          preferredStyles: ['Clean & Minimal'],
          comfortLevel: 'Regular'
        }
      }
    }
  });

  await prisma.garment.deleteMany({ where: { ownerId: user.id } });
  const created = [];
  for (const item of CATALOG) {
    created.push(
      await prisma.garment.create({
        data: {
          ownerId: user.id,
          name: item.name,
          category: item.category,
          subcategory: item.subcategory,
          primaryColor: item.primaryColor,
          colorHex: item.colorHex,
          pattern: item.pattern,
          material: item.material,
          season: item.season,
          styleTags: item.styleTags,
          occasionTags: item.occasionTags,
          laundryStatus: item.laundryStatus as LaundryStatus,
          images: { create: { originalUrl: item.imageUrl, isPrimary: true } }
        }
      })
    );
  }
  const find = (part: string) => created.find((g) => g.name.includes(part))!;
  const outfit = await prisma.outfit.create({
    data: {
      ownerId: user.id,
      name: 'Ivory Office Capsule',
      occasion: 'Office',
      mood: 'Confident',
      weather: 'Sunny',
      matchScore: 96,
      explanation: 'Tailored ivory and beige with a laundry-safe silhouette.',
      stylingTips: ['Add gold herringbone necklace.'],
      hairstyleSuggestions: 'Soft low pony',
      items: {
        create: [
          { garmentId: find('Silk Cream').id, slotType: SlotType.TOP },
          { garmentId: find('Pleated').id, slotType: SlotType.BOTTOM },
          { garmentId: find('Ivory Blazer').id, slotType: SlotType.OUTERWEAR },
          { garmentId: find('Platform Sneakers').id, slotType: SlotType.SHOE }
        ]
      }
    }
  });
  const friday = new Date();
  friday.setDate(friday.getDate() + ((5 + 7 - friday.getDay()) % 7 || 7));
  await prisma.plannedEvent.create({
    data: {
      userId: user.id,
      title: 'Client presentation',
      date: friday.toISOString().slice(0, 10),
      occasion: 'Office',
      plannedOutfit: { create: { outfitId: outfit.id } }
    }
  });
  console.log(`Seeded ${created.length} garments for ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
