import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { FlatLayCard } from '../components/FlatLayCard';

export function DailyInspirationPage() {
  const qc = useQueryClient();
  const daily = useQuery({ queryKey: ['daily'], queryFn: () => api<any>('/api/daily-outfit') });
  const refresh = useMutation({
    mutationFn: () => api('/api/daily-outfit/refresh', { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['daily'] })
  });
  const assign = useMutation({
    mutationFn: () => {
      const d = new Date();
      d.setDate(d.getDate() + ((5 + 7 - d.getDay()) % 7 || 7));
      return api('/api/planner', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Wear daily inspiration',
          date: d.toISOString().slice(0, 10),
          occasion: daily.data?.outfit?.occasion || 'Everyday',
          outfitId: daily.data?.outfit?.id
        })
      });
    }
  });
  const o = daily.data?.outfit;
  return (
    <div className="p-5 space-y-4 pb-28">
      <h1 className="font-serif text-3xl">Daily inspiration</h1>
      {o && <FlatLayCard items={o.itemIds?.map((i: any) => ({ ...i })) || []} score={o.matchScore} name={o.name} />}
      <p className="text-sm text-stone-600">{o?.explanation || 'Weather-ready editorial capsule for today.'}</p>
      <p className="text-xs">Weather suitability: {o?.weather || 'Sunny 22°C'}</p>
      <button onClick={() => refresh.mutate()} className="w-full border border-[#EBE5DF] rounded-2xl py-3 font-bold">Refresh look</button>
      <button onClick={() => assign.mutate()} className="w-full bg-charcoal text-white rounded-2xl py-3 font-bold">
        {assign.isSuccess ? 'Scheduled for next Friday' : 'Assign to next Friday'}
      </button>
    </div>
  );
}
