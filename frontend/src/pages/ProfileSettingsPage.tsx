import { useState } from 'react';
import { api } from '../api/client';

const STYLES = ['Clean & Minimal', 'Cute & Girly', 'Dark & Edgy', 'Professional', 'Romantic', 'Cozy'];

export function ProfileSettingsPage() {
  const [picked, setPicked] = useState<string[]>(['Clean & Minimal']);
  const [saved, setSaved] = useState(false);
  return (
    <div className="p-5 space-y-4 pb-28">
      <h1 className="font-serif text-3xl">Style DNA</h1>
      <div className="flex flex-wrap gap-2">
        {STYLES.map((s) => (
          <button
            key={s}
            onClick={() => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${picked.includes(s) ? 'bg-charcoal text-white' : 'bg-white border'}`}
          >
            {s}
          </button>
        ))}
      </div>
      <button
        className="w-full bg-charcoal text-white rounded-2xl py-3 font-bold"
        onClick={async () => {
          await api('/api/profile', { method: 'PATCH', body: JSON.stringify({ preferences: { preferredStyles: picked } }) });
          setSaved(true);
        }}
      >
        Save preferences
      </button>
      {saved && <p className="text-sm">Style DNA updated.</p>}
      <p className="text-[11px] text-stone-500">Privacy: garment photos stay on your account. Notifications can be muted from laundry reminders.</p>
      <button
        className="text-xs underline"
        onClick={async () => {
          await api('/api/auth/logout', { method: 'POST' });
          localStorage.removeItem('cc_token');
          window.location.href = '/login';
        }}
      >
        Log out
      </button>
    </div>
  );
}
