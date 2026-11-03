import { COUNTRIES } from '@/lib/constants';
import { SearchIcon, GlobeIcon, ArrowRightIcon } from './icons';

export default function SearchForm({ query = '', region = 'IN', compact = false }) {
  return <form className={`search-form${compact ? ' search-form-compact' : ''}`} action="/" method="GET" role="search">
    <label className="sr-only" htmlFor="movie-search">Movie title</label>
    <div className="search-input-wrap">
      <SearchIcon size={22} />
      <input id="movie-search" type="search" name="q" minLength="2" maxLength="100" placeholder="Search for a movie..." autoComplete="off" defaultValue={query} required />
    </div>
    <div className="country-select-wrap">
      <GlobeIcon size={17} />
      <label className="sr-only" htmlFor="country">Country</label>
      <select id="country" name="region" defaultValue={region} aria-label="Streaming country">
        {COUNTRIES.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}
      </select>
    </div>
    <button className="search-button" type="submit"><span>Find movie</span><ArrowRightIcon size={18} /></button>
  </form>;
}
