import Link from 'next/link';
import { notFound } from 'next/navigation';
import SearchForm from '@/components/SearchForm';
import ProviderSection from '@/components/ProviderSection';
import RegionSwitcher from '@/components/RegionSwitcher';
import { ArrowLeftIcon, ArrowUpRightIcon } from '@/components/icons';
import { WATCH_CATEGORIES } from '@/lib/constants';
import { formatRuntime, getCountryName, normalizePage, normalizeProviders, normalizeQuery, normalizeRegion, posterUrl, validMovieId, validatedWatchLink, yearFromDate } from '@/lib/utils';
import { getMovie, getMovieProviders, MovieApiError } from '@/lib/tmdb';

export async function generateMetadata({ params }) {
  const movieId = validMovieId((await params).id);
  if (!movieId) return { title: 'Movie not found' };
  try {
    const movie = await getMovie(movieId);
    return { title: `${movie.title} — Where to watch`, description: `Find out where to stream, rent, or buy ${movie.title} in your country.` };
  } catch { return { title: 'Movie details' }; }
}

export default async function MoviePage({ params, searchParams }) {
  const movieId = validMovieId((await params).id);
  if (!movieId) notFound();
  const qs = await searchParams;
  const region = normalizeRegion(qs?.region);
  const query = normalizeQuery(qs?.q);
  const page = normalizePage(qs?.page);
  const backHref = query ? `/?${new URLSearchParams({ q: query, region, page: String(page) })}` : '/';

  const [movieResult, providerResult] = await Promise.allSettled([getMovie(movieId), getMovieProviders(movieId)]);
  if (movieResult.status === 'rejected') {
    if (movieResult.reason instanceof MovieApiError && movieResult.reason.status === 404) notFound();
    throw movieResult.reason;
  }
  const movie = movieResult.value;
  const providerError = providerResult.status === 'rejected';
  const regionListing = providerError ? null : providerResult.value?.results?.[region];
  const providers = normalizeProviders(regionListing);
  const providerCount = new Set(WATCH_CATEGORIES.flatMap((group) => providers[group.key].map((p) => p.provider_id))).size;
  const poster = posterUrl(movie.poster_path, 'w500');
  const watchLink = validatedWatchLink(regionListing?.link, movieId);
  const year = yearFromDate(movie.release_date);
  const runtime = formatRuntime(movie.runtime);
  const genres = (movie.genres || []).slice(0, 3).map((genre) => genre.name).filter(Boolean);

  return <>
    <div className="detail-search-wrap"><div className="container"><SearchForm query={query} region={region} compact /></div></div>
    <article className="detail-container container">
      <Link className="back-link" href={backHref}><ArrowLeftIcon size={17} /> Back to {query ? 'search results' : 'home'}</Link>
      <div className="movie-detail-layout">
        <div className="detail-poster-column"><div className="detail-poster">
          {poster ? <img src={poster} alt={`${movie.title} poster`} width="500" height="750" /> : <div className="poster-fallback"><span>movefind.</span><strong>{movie.title}</strong></div>}
        </div><p className="poster-caption">MOVIE DETAILS FROM TMDB</p></div>
        <div className="detail-body">
          <div className="detail-eyebrow">MOVIE <span>·</span> {year}</div>
          <h1>{movie.title}</h1>
          <div className="detail-meta">{[year !== 'Year unknown' ? year : null, runtime, ...genres].filter(Boolean).map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div>
          {movie.overview ? <p className="movie-description">{movie.overview}</p> : null}
          <div className="availability-heading"><div><span className="section-kicker">STREAMING AVAILABILITY</span><h2>Where to watch</h2><p>Showing services available in <strong>{getCountryName(region)}</strong>.</p></div><RegionSwitcher movieId={movieId} region={region} query={query} page={page} /></div>
          {providerError ? <div className="availability-state"><h3>Streaming information is temporarily unavailable</h3><p>We couldn’t check providers right now. Please try again shortly.</p></div> : providerCount ? <>
            <div className="availability-status"><span className="availability-dot" /> Found {providerCount} {providerCount === 1 ? 'service' : 'services'} with watch options in {getCountryName(region)}</div>
            <ProviderSection providers={providers} />
            <a className="watch-link" href={watchLink} target="_blank" rel="noopener noreferrer">See watch links and latest options <ArrowUpRightIcon size={18} /></a>
            <p className="watch-link-caption">Opens the TMDB watch page. Provider-specific deep links are not available in this data feed.</p>
          </> : <div className="availability-state"><h3>No listings found for {getCountryName(region)}</h3><p>This means our data source doesn’t currently show a streaming, rental, or purchase option here. It doesn’t necessarily mean the movie is unavailable everywhere.</p><a href={watchLink} target="_blank" rel="noopener noreferrer" className="inline-link">Check TMDB’s watch page <ArrowUpRightIcon size={15} /></a></div>}
          <p className="source-disclaimer">Availability is supplied by <a href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer">JustWatch</a> via TMDB and refreshed on a 15-minute cache cycle. Providers, pricing, and catalogs can change. Check the service before subscribing or paying.</p>
        </div>
      </div>
    </article>
  </>;
}
