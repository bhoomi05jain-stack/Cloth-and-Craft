import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

const TABS = ['all', 'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'bags', 'accessories'];

export function WardrobePage() {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [isolated, setIsolated] = useState(false);
  const garments = useQuery({
    queryKey: ['garments', tab, q],
    queryFn: () => api<any>(`/api/garments?category=${tab}&q=${encodeURIComponent(q)}`)
  });
  return (
    <div className="p-5 pb-28">
      <h1 className="font-serif text-3xl mb-3">My closet</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-full mb-3 rounded-xl border border-[#EBE5DF] px-3 py-2 text-sm" />
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${tab === t ? 'bg-charcoal text-white' : 'bg-white border border-[#EBE5DF]'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {garments.data?.items?.map((g: any) => (
          <button key={g.id} onClick={() => setSelected(g)} className="rounded-2xl overflow-hidden bg-white border border-[#EBE5DF] text-left">
            <div className="h-28" style={{ background: g.colorHex }}>
              {g.imageUrl && <img src={g.imageUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="p-2">
              <p className="text-xs font-bold line-clamp-2">{g.name}</p>
              <p className="text-[10px] text-stone-500">{g.laundryStatus}</p>
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-end" onClick={() => setSelected(null)}>
          <div className="bg-ivory w-full rounded-t-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl">{selected.name}</h2>
            <p className="text-sm text-stone-500">{selected.primaryColor} · {selected.material}</p>
            <label className="flex items-center gap-2 mt-3 text-sm">
              <input type="checkbox" checked={isolated} onChange={(e) => setIsolated(e.target.checked)} />
              Background removal preview
            </label>
            <div className={`mt-3 h-40 rounded-2xl ${isolated ? 'bg-transparent border border-dashed border-sage' : ''}`} style={{ background: isolated ? undefined : selected.colorHex }} />
          </div>
        </div>
      )}
    </div>
  );
}
