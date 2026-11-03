import { COUNTRIES } from './constants.js';

export function normalizeRegion(value) {
  const candidate = typeof value === 'string' ? value.toUpperCase() : '';
  return COUNTRIES.some((country) => country.code === candidate) ? candidate : 'IN';
}

export function getCountryName(region) {
  return COUNTRIES.find((country) => country.code === normalizeRegion(region))?.name ?? 'India';
}

export function normalizeQuery(value) {
  return typeof value === 'string' ? value.trim().slice(0, 100) : '';
}

export function normalizePage(value) {
  const page = Number(value);
  return Number.isSafeInteger(page) && page >= 1 && page <= 500 ? page : 1;
}

export function validMovieId(value) {
  const id = typeof value === 'string' ? value : String(value ?? '');
  return /^[1-9]\d{0,9}$/.test(id) ? Number(id) : null;
}

export function yearFromDate(dateString) {
  return typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ? dateString.slice(0, 4)
    : 'Year unknown';
}

export function posterUrl(path, size = 'w342') {
  if (typeof path !== 'string' || !/^\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/.test(path)) return null;
  const safeSize = ['w185', 'w342', 'w500'].includes(size) ? size : 'w342';
  return `https://image.tmdb.org/t/p/${safeSize}${path}`;
}

export function providerLogoUrl(path) {
  if (typeof path !== 'string' || !/^\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/.test(path)) return null;
  return `https://image.tmdb.org/t/p/w92${path}`;
}

export function normalizeProviders(providers) {
  const result = {};
  for (const type of ['flatrate', 'free', 'ads', 'rent', 'buy']) {
    const seen = new Set();
    result[type] = (Array.isArray(providers?.[type]) ? providers[type] : [])
      .filter((item) => item && Number.isInteger(item.provider_id) && typeof item.provider_name === 'string')
      .filter((item) => {
        if (seen.has(item.provider_id)) return false;
        seen.add(item.provider_id);
        return true;
      })
      .sort((a, b) => (a.display_priority ?? 9999) - (b.display_priority ?? 9999));
  }
  return result;
}

export function validatedWatchLink(value, movieId) {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && ['www.themoviedb.org', 'themoviedb.org'].includes(url.hostname)) {
      return url.href;
    }
  } catch {}
  return `https://www.themoviedb.org/movie/${movieId}/watch`;
}

export function formatRuntime(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`;
}
