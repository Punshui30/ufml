import { CONFIG } from './config';

export async function api(path: string, opts: RequestInit = {}) {
  if (CONFIG.USE_MOCKS) {
    throw new Error('Mock mode enabled - API calls disabled');
  }
  
  const res = await fetch(`${CONFIG.API_URL}${path}`, {
    ...opts,
    headers: { 
      ...(opts.headers || {}), 
      ...(opts.body instanceof FormData ? {} : { "Content-Type": "application/json" }) 
    },
  }).catch((e) => {
    throw new Error(`Network error: cannot reach API at ${CONFIG.API_URL}`);
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    if (res.status === 413) throw new Error("File too large (limit 10MB).");
    if (res.status === 415) throw new Error("Unsupported file type. Please upload a PDF.");
    if (res.status >= 500) throw new Error(`Server error (${res.status}). ${msg || ""}`);
    throw new Error(`Request failed (${res.status}). ${msg || ""}`);
  }
  
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
}
