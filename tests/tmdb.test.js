import test from 'node:test';
import assert from 'node:assert/strict';
import { searchMovies, getMovieProviders, MovieApiError } from '../lib/tmdb.js';

test('search is sent to TMDB with server-side Bearer credentials', async () => {
  const savedToken = process.env.TMDB_API_READ_ACCESS_TOKEN;
  const savedFetch = globalThis.fetch;
  try {
    process.env.TMDB_API_READ_ACCESS_TOKEN = 'example_token_for_test';
    globalThis.fetch = async (url, options) => {
      assert.equal(new URL(url).pathname, '/3/search/movie');
      assert.equal(new URL(url).searchParams.get('query'), 'Inception');
      assert.equal(new URL(url).searchParams.get('include_adult'), 'false');
      assert.equal(options.headers.Authorization, 'Bearer example_token_for_test');
      assert.equal(options.next.revalidate, 600);
      return { ok: true, status: 200, json: async () => ({ results: [], total_results: 0, total_pages: 0 }) };
    };
    assert.equal((await searchMovies('Inception')).results.length, 0);
  } finally {
    globalThis.fetch = savedFetch;
    if (savedToken === undefined) delete process.env.TMDB_API_READ_ACCESS_TOKEN;
    else process.env.TMDB_API_READ_ACCESS_TOKEN = savedToken;
  }
});

test('streaming availability has a short cache policy', async () => {
  const savedToken = process.env.TMDB_API_READ_ACCESS_TOKEN;
  const savedFetch = globalThis.fetch;
  try {
    process.env.TMDB_API_READ_ACCESS_TOKEN = 'example_token_for_test';
    globalThis.fetch = async (url, options) => {
      assert.equal(new URL(url).pathname, '/3/movie/550/watch/providers');
      assert.equal(options.next.revalidate, 900);
      return { ok: true, status: 200, json: async () => ({ results: { IN: { flatrate: [] } } }) };
    };
    assert.ok((await getMovieProviders(550)).results.IN);
  } finally {
    globalThis.fetch = savedFetch;
    if (savedToken === undefined) delete process.env.TMDB_API_READ_ACCESS_TOKEN;
    else process.env.TMDB_API_READ_ACCESS_TOKEN = savedToken;
  }
});
