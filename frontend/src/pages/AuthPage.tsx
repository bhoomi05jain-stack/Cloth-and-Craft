import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('demo@closetcraft.app');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Style Muse');
  const [error, setError] = useState('');

  async function submit() {
    try {
      const path = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const data = await api<any>(path, { method: 'POST', body: JSON.stringify({ email, password, name }) });
      localStorage.setItem('cc_token', data.token);
      nav('/');
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="p-8 h-full flex flex-col justify-center space-y-4">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose font-bold">Closet Craft</p>
      <h1 className="font-serif text-4xl">Your mood. Your style. Your outfit.</h1>
      {mode === 'register' && <input className="rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />}
      <input className="rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="rounded-xl border px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-xs text-rose">{error}</p>}
      <button onClick={submit} className="bg-charcoal text-white rounded-2xl py-3 font-bold">
        {mode === 'login' ? 'Enter atelier' : 'Create account'}
      </button>
      <button className="text-xs" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Need an account?' : 'Have an account?'}
      </button>
    </div>
  );
}
