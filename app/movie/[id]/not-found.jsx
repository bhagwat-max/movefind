import Link from 'next/link';
export default function NotFoundMovie() {
  return <section className="container status-screen"><div className="section-kicker">404 · MOVIE NOT FOUND</div><h1>That movie isn’t here.</h1><p>The movie link may be incorrect. Try searching by title instead.</p><Link className="watch-link" href="/">Search for a movie →</Link></section>;
}
