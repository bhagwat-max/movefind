import Brand from './Brand';

export default function Footer() {
  return <footer className="site-footer" id="about">
    <div className="footer-content container">
      <div className="footer-top">
        <div><Brand /><p>Less searching. More watching.</p></div>
        <div className="footer-meta"><span>Made for movie nights, everywhere.</span><a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">Movie data by TMDB ↗</a></div>
      </div>
      <div className="footer-bottom">
        <div className="credits">
          <img className="tmdb-logo" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" alt="TMDB logo" width="38" height="28" loading="lazy" />
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data is provided by <a href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer">JustWatch</a> through TMDB.</p>
        </div>
        <p>Availability changes. Always confirm on the service.</p>
      </div>
    </div>
  </footer>;
}
