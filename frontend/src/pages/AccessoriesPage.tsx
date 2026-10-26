import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function AccessoriesPage() {
  const data = useQuery({ queryKey: ['acc'], queryFn: () => api<any>('/api/accessories') });
  const suggest = useQuery({ queryKey: ['acc-s'], queryFn: () => api<any>('/api/accessories/suggestions?palette=ivory,sage') });
  return (
    <div className="p-5 space-y-4 pb-28">
      <h1 className="font-serif text-3xl">Accessories</h1>
      <p className="text-xs text-stone-500">{suggest.data?.notes?.[0]}</p>
      <div className="grid grid-cols-2 gap-3">
        {data.data?.wardrobeAccessories?.map((a: any) => (
          <div key={a.id} className="rounded-2xl bg-white border p-3">
            <div className="h-16 rounded-xl" style={{ background: a.colorHex }} />
            <p className="text-xs font-bold mt-2">{a.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
