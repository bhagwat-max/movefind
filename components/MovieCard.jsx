import Link from 'next/link';
import { posterUrl, yearFromDate } from '@/lib/utils';
import { ArrowUpRightIcon } from './icons';

export default function MovieCard({ movie, region, query, page }) {
  const poster = posterUrl(movie.poster_path);
  const params = new URLSearchParams({ region, q: query, page: String(page) });
  return <Link className="movie-card" href={`/movie/${movie.id}?${params}`} aria-label={`View where to watch ${movie.title}`}>
    <div className="movie-poster">
      {poster ? <img src={poster} alt={`${movie.title} poster`} loading="lazy" width="342" height="513" /> : <div className="poster-fallback"><span>movefind.</span><strong>{movie.title}</strong></div>}
      <span className="poster-arrow" aria-hidden="true"><ArrowUpRightIcon size={19} /></span>
    </div>
    <div className="movie-card-info">
      <div className="movie-card-title">{movie.title}</div>
      <div className="movie-card-sub">{yearFromDate(movie.release_date)}{movie.vote_average > 0 ? <><span className="bullet">·</span><span className="star">★</span> {movie.vote_average.toFixed(1)}</> : null}</div>
    </div>
  </Link>;
}
