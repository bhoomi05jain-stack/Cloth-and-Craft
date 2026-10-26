import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { FlatLayCard } from '../components/FlatLayCard';

export function FavoritesPage() {
  const favs = useQuery({ queryKey: ['favs'], queryFn: () => api<any>('/api/favorites') });
  return (
    <div className="p-5 space-y-4 pb-28">
      <h1 className="font-serif text-3xl">Style vault</h1>
      {favs.data?.items?.map((look: any) => (
        <FlatLayCard key={look.id} items={look.itemIds || []} score={look.matchScore} name={look.name} />
      ))}
      {!favs.data?.items?.length && <p className="text-sm text-stone-500">Saved looks will live here.</p>}
    </div>
  );
}
