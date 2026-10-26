import { useState } from 'react';
import { CameraUploader } from '../components/CameraUploader';
import { api } from '../api/client';

export function AddClothesPage() {
  const [fileName, setFileName] = useState('');
  const [form, setForm] = useState({ name: '', category: 'tops', primaryColor: 'Ivory', colorHex: '#F7F5F0', pattern: 'Solid', material: 'Cotton', imageUrl: '' });
  const [saved, setSaved] = useState(false);

  async function analyze(nameHint: string) {
    const created = await api<any>('/api/garments', { method: 'POST', body: JSON.stringify({ ...form, name: form.name || nameHint || 'New garment' }) });
    const analysis = await api<any>(`/api/garments/${created.id}/analyze-image`, { method: 'POST' });
    const a = analysis.analysis;
    setForm((f) => ({
      ...f,
      name: f.name || a.subcategory,
      category: a.category || f.category,
      primaryColor: a.dominant_color || f.primaryColor,
      colorHex: a.color_hex || f.colorHex,
      pattern: a.pattern || f.pattern
    }));
  }

  return (
    <div className="p-5 space-y-4 pb-28">
      <h1 className="font-serif text-3xl">Add clothes</h1>
      <CameraUploader
        onCapture={(url) => {
          setForm((f) => ({ ...f, imageUrl: url }));
          setFileName('camera.jpg');
        }}
      />
      <input type="file" accept="image/*" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
      <input className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <select className="w-full rounded-xl border px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'bags', 'accessories'].map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <input className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} />
      <button className="w-full border rounded-2xl py-3 font-bold" onClick={() => analyze(fileName)}>Run AI attributes</button>
      <button
        className="w-full bg-charcoal text-white rounded-2xl py-3 font-bold"
        onClick={async () => {
          await api('/api/garments', { method: 'POST', body: JSON.stringify(form) });
          setSaved(true);
        }}
      >
        Save to closet
      </button>
      {saved && <p className="text-sm text-sage">Saved.</p>}
    </div>
  );
}
