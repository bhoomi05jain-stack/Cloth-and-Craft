import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

export function OutfitPlannerPage() {
  const qc = useQueryClient();
  const events = useQuery({ queryKey: ['planner'], queryFn: () => api<any>('/api/planner') });
  const create = useMutation({
    mutationFn: () =>
      api('/api/planner', {
        method: 'POST',
        body: JSON.stringify({ title: 'New event', date: new Date().toISOString().slice(0, 10), occasion: 'Casual' })
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['planner'] })
  });
  return (
    <div className="p-5 space-y-4 pb-28">
      <h1 className="font-serif text-3xl">Outfit planner</h1>
      <p className="text-xs uppercase tracking-widest text-stone-500">Editorial calendar</p>
      <button onClick={() => create.mutate()} className="w-full bg-charcoal text-white rounded-2xl py-3 font-bold">Add event</button>
      <div className="space-y-2">
        {events.data?.items?.map((e: any) => (
          <div key={e.id} className="rounded-2xl bg-white border border-[#EBE5DF] p-3">
            <div className="flex justify-between">
              <p className="font-bold text-sm">{e.title}</p>
              {e.hasConflict && <span className="text-[10px] font-bold bg-rose/40 text-charcoal px-2 py-0.5 rounded-full">Conflict</span>}
            </div>
            <p className="text-xs text-stone-500">{e.date} · {e.occasion}</p>
            {e.conflictDetails && <p className="text-[10px] text-rose mt-1">{e.conflictDetails}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
