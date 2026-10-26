type Item = { garment?: { name?: string; imageUrl?: string; colorHex?: string; category?: string }; slotType?: string };

export function FlatLayCard({ items, score, name, onSwap }: { items: Item[]; score?: number; name?: string; onSwap?: (slot: string) => void }) {
  const slots = ['TOP', 'BOTTOM', 'OUTERWEAR', 'SHOE', 'DRESS', 'BAG'];
  const mapped = slots
    .map((s) => items.find((i) => i.slotType === s || i.garment?.category?.toUpperCase().includes(s.slice(0, 3))))
    .filter(Boolean)
    .slice(0, 4);
  const cells = mapped.length ? mapped : items.slice(0, 4);
  return (
    <div className="rounded-3xl bg-white border border-[#EBE5DF] p-3 shadow-sm">
      <div className="grid grid-cols-2 gap-2 bg-[#F6F4F1] rounded-2xl p-2 min-h-[220px]">
        {cells.map((cell, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSwap?.(cell?.slotType || 'BOTTOM')}
            className="relative rounded-xl overflow-hidden bg-ivory aspect-square"
          >
            {cell?.garment?.imageUrl ? (
              <img src={cell.garment.imageUrl} alt={cell.garment.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: cell?.garment?.colorHex || '#A5B5A0' }} />
            )}
            <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-white/90 px-1.5 py-0.5 rounded-full">{cell?.garment?.name?.split(' ').slice(-2).join(' ')}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3">
        <div>
          <p className="text-xs font-bold">{name || 'Editorial look'}</p>
          <p className="text-[10px] text-stone-500">{cells.length} piece flat-lay</p>
        </div>
        {score != null && <span className="text-xs font-bold border border-[#EBE5DF] rounded-full px-2 py-1">{score}% match</span>}
      </div>
    </div>
  );
}
