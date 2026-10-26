const API = import.meta.env.VITE_API_URL || '';

export function token() {
  return localStorage.getItem('cc_token') || '';
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const t = token();
  if (t) headers.set('Authorization', `Bearer ${t}`);
  const res = await fetch(`${API}${path}`, { ...init, headers, credentials: 'include' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data as T;
}
