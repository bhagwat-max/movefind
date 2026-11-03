import { COUNTRIES } from '@/lib/constants';

export default function RegionSwitcher({ movieId, region, query, page }) {
  return <form action={`/movie/${movieId}`} method="GET" className="region-switcher" aria-label="Change streaming country">
    {query ? <input type="hidden" name="q" value={query} /> : null}
    {page > 1 ? <input type="hidden" name="page" value={page} /> : null}
    <label htmlFor="watch-region">Country</label>
    <div className="region-switcher-controls">
      <select id="watch-region" name="region" defaultValue={region}>
        {COUNTRIES.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}
      </select>
      <button type="submit">Update</button>
    </div>
  </form>;
}
