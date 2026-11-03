'use client';
export default function ErrorPage({ reset }) {
  return <section className="container status-screen"><div className="section-kicker">SOMETHING WENT WRONG</div><h1>We hit a small snag.</h1><p>Movie information couldn’t be loaded. Please try again.</p><button className="watch-link" type="button" onClick={() => reset()}>Try again ↗</button></section>;
}
