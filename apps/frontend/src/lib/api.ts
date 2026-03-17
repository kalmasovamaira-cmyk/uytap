const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getHeaders(token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: { ...getHeaders(token), ...(rest.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Ошибка запроса' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth
export const authApi = {
  register: (data: any) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  refresh: (refreshToken: string) => apiFetch('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  me: (token: string) => apiFetch('/auth/me', { token }),
};

// Listings
export const listingsApi = {
  getAll: (params?: URLSearchParams) => apiFetch(`/listings?${params?.toString() || ''}`),
  getFeatured: () => apiFetch('/listings/featured'),
  getOne: (id: string) => apiFetch(`/listings/${id}`),
  getMy: (token: string) => apiFetch('/listings/my', { token }),
  create: (data: any, token: string) => apiFetch('/listings', { method: 'POST', body: JSON.stringify(data), token }),
  update: (id: string, data: any, token: string) => apiFetch(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: (id: string, token: string) => apiFetch(`/listings/${id}`, { method: 'DELETE', token }),
};

// Search
export const searchApi = {
  search: (params: URLSearchParams) => apiFetch(`/search?${params.toString()}`),
  suggestions: (q: string) => apiFetch(`/search/suggestions?q=${encodeURIComponent(q)}`),
};

// Locations
export const locationsApi = {
  getCities: () => apiFetch('/locations/cities'),
  getCity: (slug: string) => apiFetch(`/locations/cities/${slug}`),
  getDistricts: (cityId: string) => apiFetch(`/locations/cities/${cityId}/districts`),
};

// Categories
export const categoriesApi = {
  getAll: () => apiFetch('/categories'),
};

// Favorites
export const favoritesApi = {
  getAll: (token: string) => apiFetch('/favorites', { token }),
  toggle: (listingId: string, token: string) => apiFetch(`/favorites/${listingId}/toggle`, { method: 'POST', token }),
};

// Stats
export const statsApi = {
  getPublic: () => apiFetch('/stats/public'),
  getMy: (token: string) => apiFetch('/stats/my', { token }),
};
