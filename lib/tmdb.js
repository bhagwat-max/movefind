const API = 'https://api.themoviedb.org/3';

export class MovieApiError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.name = 'MovieApiError';
    this.status = status;
  }
}

async function tmdbGet(path, params = {}, revalidate = 900) {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN?.trim();
  const apiKey = process.env.TMDB_API_KEY?.trim();
  if ((!token || token === 'put_your_tmdb_read_access_token_here') && !apiKey) {
    throw new MovieApiError('API_NOT_CONFIGURED', 503);
  }
  const url = new URL(`${API}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  if (!token || token === 'put_your_tmdb_read_access_token_here') {
    url.searchParams.set('api_key', apiKey);
  }
  let response;
  try {
    response = await fetch(url, {
      headers: {
        accept: 'application/json',
        ...(token && token !== 'put_your_tmdb_read_access_token_here' ? { Authorization: `Bearer ${token}` } : {})
      },
      next: { revalidate },
      signal: AbortSignal.timeout(9000)
    });
  } catch {
    throw new MovieApiError('MOVIE_API_UNAVAILABLE', 502);
  }
  if (response.status === 404) throw new MovieApiError('MOVIE_NOT_FOUND', 404);
  if (!response.ok) throw new MovieApiError(response.status === 401 ? 'INVALID_API_CREDENTIALS' : 'MOVIE_API_UNAVAILABLE', response.status);
  try {
    return await response.json();
  } catch {
    throw new MovieApiError('MOVIE_API_UNAVAILABLE', 502);
  }
}

export async function searchMovies(query, page = 1) {
  return tmdbGet('/search/movie', {
    query,
    page,
    include_adult: 'false',
    language: 'en-US'
  }, 600);
}

export async function getMovie(movieId) {
  return tmdbGet(`/movie/${movieId}`, { language: 'en-US' }, 21600);
}

export async function getMovieProviders(movieId) {
  return tmdbGet(`/movie/${movieId}/watch/providers`, {}, 900);
}
