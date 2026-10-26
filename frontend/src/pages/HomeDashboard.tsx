import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { FlatLayCard } from '../components/FlatLayCard';

export function HomeDashboard() {
  const daily = useQuery({ queryKey: ['daily'], queryFn: () => api<any>('/api/daily-outfit') });
  const laundry = useQuery({ queryKey: ['laundry'], queryFn: () => api<any>('/api/laundry') });
  const outfit = daily.data?.outfit;
  return (
    <div className="p-5 space-y-5 pb-28">
      <header className="flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-rose font-bold">Daily stylist</p>
          <h1 className="font-serif text-3xl">Today’s look</h1>
        </div>
        <span className="text-xs bg-white border border-[#EBE5DF] rounded-full px-3 py-1">☀️ 22°C</span>
      </header>
      {outfit && <FlatLayCard items={outfit.itemIds?.map((i: any) => ({ garment: { ...i, imageUrl: undefined }, slotType: i.slotType })) || []} score={outfit.matchScore} name={outfit.name} />}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/generate" className="rounded-2xl bg-charcoal text-white p-4">
          <p className="text-xs text-sage">Mood studio</p>
          <p className="font-serif text-xl">Generate</p>
        </Link>
        <Link to="/laundry" className="rounded-2xl bg-white border border-[#EBE5DF] p-4">
          <p className="text-xs text-stone-500">Laundry</p>
          <p className="font-serif text-xl">{laundry.data?.summary?.inLaundry ?? 0} in wash</p>
        </Link>
      </div>
      <Link to="/add" className="block text-center text-sm font-semibold text-sage">Quick upload a garment →</Link>
    </div>
  );
}
