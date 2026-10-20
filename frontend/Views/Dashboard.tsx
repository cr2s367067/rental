import { ArrowUpRight, Building2, Wallet, CalendarDays, FolderLock } from 'lucide-react';
import { useDashboard, metricLinks } from '../VMs/dashboard.vm';
import { useRoute, link } from '../VMs/navigation.vm';
import { formatTWD } from '../Models/money';
import type { SessionView } from '../Generated/types.gen';
import { PropertyFilter } from './shared/Collection';
import { Feedback } from './shared/FormLayout';
import { Button } from './shared/Button';
import { errorMessage } from '../Services/client';
export function Dashboard({ session }: { session: SessionView }) {
  const route = useRoute();
  const query = useDashboard({
      property_id: route.query.property_id || undefined,
      business_date: route.query.business_date || undefined,
    }),
    data = query.data;
  const occupied = data?.counts.occupied_resources || 0,
    available = data?.counts.available_resources || 0,
    total = data?.counts.total_resources || 0;
  const percentage = total ? Math.round((occupied / total) * 100) : 0;
  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">PROPERTY OPERATIONS</p>
          <h1>Overview</h1>
          <p>A clear view of your spaces, tenants and rental commitments.</p>
        </div>
        <div className="status status-good">
          <CalendarDays size={13} />
          {data?.business_date || session.business_date} · Asia/Taipei
        </div>
      </div>
      <PropertyFilter session={session} path="/" query={route.query} />
      <Feedback pending={query.isPending} error={query.error ? errorMessage(query.error) : ''} />
      {query.isError && (
        <Button variant="outline" onClick={() => query.refetch()}>
          Try again
        </Button>
      )}
      {data && (
        <>
          {data.counts.total_properties === 0 && (
            <section className="card">
              <h2>No properties in this scope</h2>
              <p>Records and metrics will appear when properties are available to this account.</p>
            </section>
          )}
          <section className="metric-grid dashboard-metrics" aria-label="Operational metrics">
            {metricLinks(data).map((metric) => (
              <a
                className="metric"
                href={metric.href}
                data-metric={metric.key}
                key={metric.key}
                aria-label={'View ' + metric.label}
              >
                <small>{metric.label}</small>
                <ArrowUpRight size={15} aria-hidden />
                <strong>{metric.count}</strong>
                <p>{metric.description}</p>
              </a>
            ))}
          </section>
          <div className="detail-grid">
            <section className="card occupancy-card">
              <div className="section-heading">
                <span className="section-icon">
                  <Building2 size={18} />
                </span>
                <div>
                  <h2>Resource occupancy</h2>
                  <p>Contract-driven availability</p>
                </div>
              </div>
              <div className="occupancy-value">
                <strong>{percentage}%</strong>
                <span>occupied</span>
              </div>
              <div
                className="occupancy-track"
                role="img"
                aria-label={`${occupied} occupied and ${available} available of ${total} resources`}
              >
                <span style={{ width: percentage + '%' }} />
              </div>
              <div className="occupancy-legend">
                <span>
                  <i className="legend-dot" />
                  {occupied} occupied
                </span>
                <span>
                  <i className="legend-dot legend-free" />
                  {available} available
                </span>
              </div>
              <small>
                Shared rooms count as occupied while any contract is active; free slots appear in
                Resources.
              </small>
            </section>
            <section className="card outstanding-card">
              <div className="section-heading">
                <span className="section-icon">
                  <Wallet size={18} />
                </span>
                <div>
                  <h2>Outstanding rent</h2>
                  <p>Exact unpaid balance across periods</p>
                </div>
              </div>
              <strong className="outstanding-value" data-testid="outstanding-twd">
                {formatTWD(data.counts.outstanding_twd)}
              </strong>
              <p>
                {data.counts.unpaid_rent_periods} rental periods have a positive balance, including
                partial and not-yet-due amounts.
              </p>
              <Button asChild variant="outline">
                <a
                  href={link('/payments', {
                    property_id: data.property_id || undefined,
                    business_date: data.business_date,
                    metric: 'unpaid_rent_periods',
                  })}
                >
                  Review outstanding periods
                  <ArrowUpRight size={14} />
                </a>
              </Button>
            </section>
          </div>
          <section className="card document-summary">
            <div className="section-heading">
              <FolderLock size={20} />
              <div>
                <h2>Records stay connected</h2>
                <p>
                  {data.counts.document_metadata_count} protected documents in this scope. Property,
                  tenant, contract and payment records share the same access rules.
                </p>
              </div>
            </div>
            <Button asChild variant="outline">
              <a
                href={link('/documents', {
                  property_id: data.property_id || undefined,
                  business_date: data.business_date,
                })}
              >
                Open document library
              </a>
            </Button>
          </section>
        </>
      )}
    </>
  );
}
