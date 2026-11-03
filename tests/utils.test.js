import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeRegion, normalizeQuery, normalizePage, validMovieId, normalizeProviders,
  posterUrl, providerLogoUrl, validatedWatchLink, yearFromDate
} from '../lib/utils.js';

test('country and search inputs are sanitized', () => {
  assert.equal(normalizeRegion('us'), 'US');
  assert.equal(normalizeRegion('not-a-country'), 'IN');
  assert.equal(normalizeQuery('  Arrival  '), 'Arrival');
  assert.equal(normalizeQuery('a'.repeat(150)).length, 100);
  assert.equal(normalizePage('-10'), 1);
  assert.equal(normalizePage('3'), 3);
});

test('movie IDs and images reject unsafe values', () => {
  assert.equal(validMovieId('123'), 123);
  assert.equal(validMovieId('../123'), null);
  assert.equal(posterUrl('/nice.jpg'), 'https://image.tmdb.org/t/p/w342/nice.jpg');
  assert.equal(posterUrl('https://evil.test/a.jpg'), null);
  assert.equal(providerLogoUrl('/ok.png'), 'https://image.tmdb.org/t/p/w92/ok.png');
  assert.equal(yearFromDate('2024-02-01'), '2024');
});

test('listings deduplicate providers and retain type distinctions', () => {
  const rows = [{ provider_id: 8, provider_name: 'Stream A', display_priority: 2 }, { provider_id: 8, provider_name: 'Stream A', display_priority: 2 }];
  const normalized = normalizeProviders({ flatrate: rows, rent: rows });
  assert.equal(normalized.flatrate.length, 1);
  assert.equal(normalized.rent.length, 1);
  assert.equal(normalized.buy.length, 0);
});

test('watch links only target TMDB HTTPS domains', () => {
  assert.equal(validatedWatchLink('https://www.themoviedb.org/movie/22/watch', 22), 'https://www.themoviedb.org/movie/22/watch');
  assert.equal(validatedWatchLink('javascript:alert(1)', 22), 'https://www.themoviedb.org/movie/22/watch');
  assert.equal(validatedWatchLink('https://themoviedb.org.evil.test/x', 22), 'https://www.themoviedb.org/movie/22/watch');
});
