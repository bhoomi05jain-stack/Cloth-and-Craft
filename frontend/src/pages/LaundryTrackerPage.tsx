import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

export function LaundryTrackerPage() {
  const qc = useQueryClient();
  const laundry = useQuery({ queryKey: ['laundry'], queryFn: () => api<any>('/api/laundry') });
  const patch = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api(`/api/laundry/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['laundry'] });
      qc.invalidateQueries({ queryKey: ['planner'] });
    }
  });
  return (
    <div className="p-5 space-y-4 pb-28">
      <h1 className="font-serif text-3xl">Laundry tracker</h1>
      <div className="rounded-2xl bg-sage/30 p-4">
        <p className="text-xs font-bold uppercase">Smart wash shield</p>
        <p className="text-sm">{laundry.data?.summary?.inLaundry ?? 0} pieces protected from outfit generation.</p>
        {laundry.data?.summary?.reminder && <p className="text-xs mt-2 font-semibold">{laundry.data.summary.reminder}</p>}
      </div>
      {laundry.data?.items?.map((g: any) => (
        <div key={g.id} className="bg-white border border-[#EBE5DF] rounded-2xl p-3 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold">{g.name}</p>
            <p className="text-[10px]">{g.laundryStatus} · {g.daysInLaundry}d in wash</p>
          </div>
          <button className="text-xs font-bold bg-charcoal text-white rounded-full px-3 py-1" onClick={() => patch.mutate({ id: g.id, status: 'CLEAN' })}>
            Mark clean
          </button>
        </div>
      ))}
    </div>
  );
}
