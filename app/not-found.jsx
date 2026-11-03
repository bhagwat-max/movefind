import Link from 'next/link';
export default function NotFound() {
  return <section className="container status-screen"><div className="section-kicker">404 · NOT FOUND</div><h1>Wrong turn?</h1><p>This page doesn't exist. Your next movie does, though.</p><Link className="watch-link" href="/">Back to movie search →</Link></section>;
}
