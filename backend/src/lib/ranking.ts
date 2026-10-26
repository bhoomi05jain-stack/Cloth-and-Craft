export const UNAVAILABLE = new Set(['IN_LAUNDRY', 'WASHING', 'DRYING', 'DAMAGED', 'InLaundry', 'Washing', 'Drying', 'Damaged', 'in_laundry']);

const TOPS = new Set(['tops', 'top', 'shirt', 'kurti']);
const BOTTOMS = new Set(['bottoms', 'bottom', 'jeans', 'pants', 'skirt', 'trousers']);
const DRESSES = new Set(['dresses', 'dress', 'traditional', 'gown']);
const OUTER = new Set(['outerwear', 'jacket', 'coat', 'blazer', 'sweater']);
const SHOES = new Set(['shoes', 'footwear', 'sneakers', 'heels', 'boots', 'sandals']);
const BAGS = new Set(['bags', 'bag', 'tote', 'handbag']);
const ACC = new Set(['accessories', 'jewellery', 'jewelry', 'sunglasses', 'scarves']);

export type RankGarment = {
  id: string;
  name: string;
  category: string;
  primaryColor: string;
  styleTags: string[];
  occasionTags: string[];
  laundryStatus: string;
  imageUrl?: string;
};

export function generateLocalOutfits(
  garments: RankGarment[],
  opts: { occasion: string; moods: string[]; preferredColors: string[]; colorsToAvoid: string[]; weather?: string; temperatureC?: number; max: number }
) {
  const clean = garments.filter((g) => !UNAVAILABLE.has(g.laundryStatus) && !UNAVAILABLE.has(g.laundryStatus.replace('_', '')));
  const tops = clean.filter((g) => TOPS.has(g.category.toLowerCase()));
  const bottoms = clean.filter((g) => BOTTOMS.has(g.category.toLowerCase()));
  const dresses = clean.filter((g) => DRESSES.has(g.category.toLowerCase()));
  const outer = clean.filter((g) => OUTER.has(g.category.toLowerCase()));
  const shoes = clean.filter((g) => SHOES.has(g.category.toLowerCase()));
  const bags = clean.filter((g) => BAGS.has(g.category.toLowerCase()));
  const acc = clean.filter((g) => ACC.has(g.category.toLowerCase()));

  const combos: RankGarment[][] = [];
  for (const t of tops) {
    for (const b of bottoms) {
      const combo = [t, b];
      if (shoes.length) combo.push(shoes[Math.abs(hash(t.id + b.id)) % shoes.length]);
      if (bags.length) combo.push(bags[Math.abs(hash(t.id + b.id)) % bags.length]);
      if (acc.length) combo.push(acc[Math.abs(hash(t.id + b.id)) % acc.length]);
      if (outer.length && (opts.temperatureC ?? 22) < 20) combo.push(outer[Math.abs(hash(t.id)) % outer.length]);
      combos.push(combo);
    }
  }
  for (const d of dresses) {
    const combo = [d];
    if (shoes.length) combo.push(shoes[Math.abs(hash(d.id)) % shoes.length]);
    if (bags.length) combo.push(bags[Math.abs(hash(d.id)) % bags.length]);
    if (acc.length) combo.push(acc[Math.abs(hash(d.id)) % acc.length]);
    combos.push(combo);
  }

  const weights = { occasion: 0.25, mood: 0.2, color: 0.15, weather: 0.1, category: 0.1, accessory: 0.05, novelty: 0.1, feedback: 0.05 };

  const scored = combos.map((items, idx) => {
    const occ = Math.min(1, 0.6 + (items.filter((i) => i.occasionTags.some((o) => o.toLowerCase().includes(opts.occasion.toLowerCase()))).length / items.length) * 0.4);
    const mood = Math.min(1, 0.5 + items.filter((i) => i.styleTags.some((s) => opts.moods.some((m) => s.toLowerCase().includes(m.toLowerCase())))).length * 0.2);
    const colors = items.map((i) => i.primaryColor.toLowerCase());
    const avoided = colors.some((c) => opts.colorsToAvoid.some((a) => c.includes(a.toLowerCase())));
    const preferred = colors.some((c) => opts.preferredColors.some((a) => c.includes(a.toLowerCase())));
    const color = avoided ? 0.3 : preferred ? 0.95 : 0.85;
    const hasOuter = items.some((i) => OUTER.has(i.category.toLowerCase()));
    const temp = opts.temperatureC ?? 22;
    const weather = temp < 18 ? (hasOuter ? 0.95 : 0.7) : temp > 25 ? (hasOuter ? 0.65 : 0.95) : 0.9;
    const cats = new Set(items.map((i) => i.category.toLowerCase()));
    const category = ([...cats].some((c) => TOPS.has(c)) && [...cats].some((c) => BOTTOMS.has(c))) || [...cats].some((c) => DRESSES.has(c)) ? 1 : 0.4;
    const accessory = items.some((i) => ACC.has(i.category.toLowerCase()) || BAGS.has(i.category.toLowerCase())) ? 0.95 : 0.75;
    const novelty = 0.9;
    const feedback = 0.85;
    const breakdown = { occasion: occ, mood, color, weather, category, accessory, novelty, feedback };
    const score = (Object.keys(weights) as (keyof typeof weights)[]).reduce((s, k) => s + breakdown[k] * weights[k], 0);
    return { idx, items, score, breakdown };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, opts.max).map((s, i) => ({
    id: `local-${i}-${s.items[0].id.slice(0, 8)}`,
    name: `${opts.moods[0] || 'Effortless'} ${s.items[0].name.split(' ')[0]} Ensemble`,
    occasion: opts.occasion,
    mood: opts.moods[0] || 'Daily',
    weather: opts.weather,
    matchScore: Math.round(s.score * 1000) / 10,
    scoreBreakdown: Object.fromEntries(Object.entries(s.breakdown).map(([k, v]) => [k, Math.round(v * 1000) / 10])),
    explanation: `Curated for '${opts.occasion}' with a '${opts.moods[0] || 'refined'}' mood using ${s.items[0].name}.`,
    stylingTips: ['Keep jewellery warm-toned against ivory and sage neutrals.', 'Tuck or half-tuck for editorial proportion.'],
    hairstyleTips: 'Soft low pony or relaxed waves.',
    items: s.items
  }));
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
