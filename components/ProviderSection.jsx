import { WATCH_CATEGORIES } from '@/lib/constants';
import { providerLogoUrl } from '@/lib/utils';

export default function ProviderSection({ providers }) {
  return <div className="providers-grid">
    {WATCH_CATEGORIES.filter((category) => providers[category.key]?.length).map((category) => (
      <section className="provider-group" key={category.key}>
        <div className="provider-group-heading"><h3>{category.label}</h3><span className="provider-number">{providers[category.key].length}</span></div>
        <p className="provider-group-note">{category.note}</p>
        <div className="provider-list">
          {providers[category.key].map((provider) => {
            const image = providerLogoUrl(provider.logo_path);
            return <div className="provider-row" key={provider.provider_id}>
              {image ? <img src={image} width="44" height="44" loading="lazy" alt="" className="provider-icon" /> : <div className="provider-icon provider-icon-fallback" aria-hidden="true">{provider.provider_name.slice(0, 1)}</div>}
              <span>{provider.provider_name}</span>
            </div>;
          })}
        </div>
      </section>
    ))}
  </div>;
}
