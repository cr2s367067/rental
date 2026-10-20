import type { SessionView } from '../../Generated/types.gen';
import { link } from '../../VMs/navigation.vm';
import { Button } from './Button';
export function PropertyFilter({
  session,
  path,
  query,
}: {
  session: SessionView;
  path: string;
  query: Record<string, string>;
}) {
  return (
    <div className="filters">
      <label className="sr-only" htmlFor="property-filter">
        Property filter
      </label>
      <select
        id="property-filter"
        value={query.property_id || ''}
        onChange={(e) => {
          window.location.hash = link(path, {
            ...query,
            property_id: e.target.value || undefined,
            page: '1',
          }).slice(1);
        }}
      >
        <option value="">All permitted properties</option>
        {session.properties.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      {query.metric && <span className="status">{query.metric.replaceAll('_', ' ')}</span>}
      {query.business_date && <small>Records as of {query.business_date} · Asia/Taipei</small>}
    </div>
  );
}
export function Pagination({
  data,
  path,
  query,
}: {
  data?: { total: number; page: number; page_size: number; business_date: string };
  path: string;
  query: Record<string, string>;
}) {
  if (!data) return null;
  return (
    <div className="pagination">
      <span>
        {data.total} records · {data.business_date}
      </span>
      <div className="actions">
        <Button asChild variant="ghost" disabled={data.page <= 1}>
          <a
            aria-disabled={data.page <= 1}
            onClick={(e) => {
              if (data.page <= 1) e.preventDefault();
            }}
            tabIndex={data.page <= 1 ? -1 : 0}
            href={link(path, { ...query, page: String(Math.max(1, data.page - 1)) })}
          >
            Previous
          </a>
        </Button>
        <Button asChild variant="ghost" disabled={data.page * data.page_size >= data.total}>
          <a
            aria-disabled={data.page * data.page_size >= data.total}
            onClick={(e) => {
              if (data.page * data.page_size >= data.total) e.preventDefault();
            }}
            tabIndex={data.page * data.page_size >= data.total ? -1 : 0}
            href={link(path, { ...query, page: String(data.page + 1) })}
          >
            Next
          </a>
        </Button>
      </div>
    </div>
  );
}
