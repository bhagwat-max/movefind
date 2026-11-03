import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import MovieCard from '@/components/MovieCard';
import { ArrowRightIcon, CheckIcon, GlobeIcon, SearchIcon } from '@/components/icons';
import { SUGGESTIONS } from '@/lib/constants';
import { getCountryName, normalizePage, normalizeQuery, normalizeRegion } from '@/lib/utils';
import { MovieApiError, searchMovies } from '@/lib/tmdb';

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const query = normalizeQuery(params?.q);
  const region = normalizeRegion(params?.region);
  const page = normalizePage(params?.page);
  const isSearch = query.length >= 2;
  let result = null;
  let error = null;
  if (isSearch) {
    try { result = await searchMovies(query, page); }
    catch (e) { error = e instanceof MovieApiError ? e.message : 'MOVIE_API_UNAVAILABLE'; }
  }

  return <>
    <section className={`hero container${isSearch ? ' hero-results' : ''}`}>
      <div className="eyebrow"><span className="eyebrow-dot" /> THE MOVIE SEARCH, SIMPLIFIED</div>
      {isSearch ? <>
        <h1>Find your next <span className="italic-accent">watch.</span></h1>
        <p className="hero-description">One search. Streaming options in your country.</p>
      </> : <>
        <h1>Know where to <span className="italic-accent">watch.</span><br />In seconds.</h1>
        <p className="hero-description">Your movie is out there. Find the streaming service that has it — without jumping between apps.</p>
      </>}
      <SearchForm query={query} region={region} compact={isSearch} />
      {!isSearch ? <div className="suggestions"><span>TRY SEARCHING</span><div className="suggestion-items">
        {SUGGESTIONS.map((title) => <Link key={title} href={`/?${new URLSearchParams({ q: title, region })}`}>{title}<ArrowRightIcon size={13} /></Link>)}
      </div></div> : null}
    </section>

    {isSearch ? <section className="search-results container" aria-live="polite">
      {error ? <div className="status-panel"><h2>{error === 'API_NOT_CONFIGURED' ? 'One quick setup step' : 'We couldn’t load movies right now.'}</h2><p>{error === 'API_NOT_CONFIGURED' ? 'Add your TMDB API Read Access Token as TMDB_API_READ_ACCESS_TOKEN in your project’s environment variables, then restart or redeploy.' : error === 'INVALID_API_CREDENTIALS' ? 'The TMDB credentials were rejected. Check the token in your environment settings.' : 'Please try your search again in a moment.'}</p></div> : result?.results?.length ? <>
        <div className="section-heading">
          <div><div className="section-kicker">SEARCH RESULTS</div><h2>Results for “{query}”</h2><p>Showing movies · Availability for <strong>{getCountryName(region)}</strong></p></div>
          <span className="count-pill">{result.total_results?.toLocaleString('en-US') || result.results.length} matches</span>
        </div>
        <div className="movie-grid">{result.results.map((movie) => <MovieCard movie={movie} key={movie.id} region={region} query={query} page={page} />)}</div>
        {result.total_pages > 1 ? <div className="pagination">
          {page > 1 ? <Link className="pagination-button" href={`/?${new URLSearchParams({ q: query, region, page: String(page - 1) })}`}>← Previous</Link> : <span />}
          <span>Page {page} of {Math.min(result.total_pages, 500)}</span>
          {page < result.total_pages && page < 500 ? <Link className="pagination-button" href={`/?${new URLSearchParams({ q: query, region, page: String(page + 1) })}`}>Next →</Link> : <span />}
        </div> : null}
      </> : <div className="status-panel"><h2>No movies found for “{query}”</h2><p>Try another spelling, or search using the original movie title.</p><Link href="/" className="text-link">Start a new search →</Link></div>}
    </section> : <>
      <section className="how-section container">
        <div className="how-label">ONE LESS THING TO GOOGLE</div>
        <div className="how-layout">
          <div><h2>The right movie.<br /><em>The right place.</em></h2><p>No endless tabs or guesswork. MoveFind makes choosing movie night easier.</p></div>
          <div className="steps">
            <div className="step"><span className="step-icon"><SearchIcon size={21} /></span><div><strong>Search a title</strong><p>Look up any movie by its name.</p></div><span className="step-index">01</span></div>
            <div className="step"><span className="step-icon"><GlobeIcon size={21} /></span><div><strong>Pick your country</strong><p>Streaming libraries are different everywhere.</p></div><span className="step-index">02</span></div>
            <div className="step"><span className="step-icon"><CheckIcon size={21} /></span><div><strong>See your options</strong><p>Stream, rent, buy, or watch for free.</p></div><span className="step-index">03</span></div>
          </div>
        </div>
      </section>
      <div className="closing-band"><div className="container closing-band-inner"><div><span className="mini-eyebrow">LESS BROWSING. MORE MOVIES.</span><h2>Movie night starts here.</h2></div><a className="closing-link" href="#movie-search">Find a movie <ArrowRightIcon size={18} /></a></div></div>
    </>}
  </>;
}
