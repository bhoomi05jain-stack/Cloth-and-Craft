import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../api/client';
import { FlatLayCard } from '../components/FlatLayCard';

const MOODS = ['Confident', 'Calm', 'Playful', 'Romantic', 'Professional', 'Cozy'];
const EVENTS = ['Office', 'Brunch', 'Casual outing', 'Date Night', 'Wedding', 'Travel'];

export function GenerateOutfitPage() {
  const [mood, setMood] = useState('Confident');
  const [occasion, setOccasion] = useState('Office');
  const [color, setColor] = useState('Ivory');
  const generate = useMutation({
    mutationFn: () =>
      api<any>('/api/outfits/generate', {
        method: 'POST',
        body: JSON.stringify({ moods: [mood], occasion, preferredColors: [color], maxRecommendations: 4 })
      })
  });
  const swap = useMutation({
    mutationFn: ({ id, slot }: { id: string; slot: string }) =>
      api(`/api/outfits/${id}/regenerate-item`, { method: 'POST', body: JSON.stringify({ slotType: slot }) })
  });

  return (
    <div className="p-5 space-y-4 pb-28">
      <h1 className="font-serif text-3xl">Generate my outfit</h1>
      <p className="text-xs text-stone-500">Your mood. Your style. Your outfit.</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {MOODS.map((m) => (
          <button key={m} onClick={() => setMood(m)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${mood === m ? 'bg-charcoal text-white' : 'bg-white border border-[#EBE5DF]'}`}>
            {m}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {EVENTS.map((e) => (
          <button key={e} onClick={() => setOccasion(e)} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${occasion === e ? 'bg-sage text-charcoal' : 'bg-white border border-[#EBE5DF]'}`}>
            {e}
          </button>
        ))}
      </div>
      <input value={color} onChange={(e) => setColor(e.target.value)} className="w-full rounded-xl border border-[#EBE5DF] px-3 py-2 text-sm" placeholder="Preferred color" />
      <button onClick={() => generate.mutate()} className="w-full bg-charcoal text-white rounded-2xl py-3 font-bold">
        {generate.isPending ? 'Styling…' : 'Generate my outfit'}
      </button>
      {generate.data?.items?.map((look: any) => (
        <div key={look.id} className="space-y-2">
          <FlatLayCard items={look.items} score={look.matchScore} name={look.name} onSwap={(slot) => swap.mutate({ id: look.id, slot })} />
          <p className="text-xs text-stone-600">{look.explanation}</p>
          <button
            className="text-xs font-bold"
            onClick={() => api(`/api/outfits/${look.id}/favorite`, { method: 'POST' })}
          >
            Save to Style Vault
          </button>
        </div>
      ))}
    </div>
  );
}
