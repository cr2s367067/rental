import { ArrowUpRight, Building2, Wallet, CalendarDays, FolderLock, ChartPie } from 'lucide-react';
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
  const metrics = data ? metricLinks(data) : [];
  const metric = (key: string, prominent = false) => {
    const item = metrics.find((entry) => entry.key === key);
    if (!item) return null;
    return (
      <a
        className={prominent ? 'dashboard-primary-metric' : 'dashboard-metric-row'}
        href={item.href}
        data-metric={item.key}
        aria-label={'View ' + item.label}
      >
        <span className="dashboard-metric-label">
          <span>{item.label}</span>
          {!prominent && <small>{item.description}</small>}
        </span>
        <strong>{item.count}</strong>
        <ArrowUpRight size={16} aria-hidden />
      </a>
    );
  };
  const scope = { property_id: data?.property_id || undefined, business_date: data?.business_date };

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">PROPERTY OPERATIONS</p>
          <h1>Overview</h1>
          <p>Your portfolio, occupancy and next steps. All in one place.</p>
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
            <p role="status">
              No properties in this scope. Metrics will appear when properties are available to this
              account.
            </p>
          )}
          <div className="dashboard-panels" aria-label="Operational overview">
            <section className="dashboard-panel" aria-labelledby="portfolio-heading">
              <div className="dashboard-panel-heading">
                <span className="section-icon">
                  <Building2 size={20} aria-hidden />
                </span>
                <h2 id="portfolio-heading">Your portfolio</h2>
                <span className="dashboard-panel-index" aria-hidden>
                  01
                </span>
              </div>
              {metric('total_properties', true)}
              <p className="dashboard-panel-caption">The spaces and people you manage.</p>
              <div className="dashboard-panel-details">
                {metric('total_resources')}
                {metric('current_tenants')}
              </div>
              <a className="dashboard-panel-footer" href={link('/documents', scope)}>
                <FolderLock size={16} aria-hidden />
                <span>{data.counts.document_metadata_count} protected documents</span>
                <ArrowUpRight size={16} aria-hidden />
              </a>
            </section>

            <section
              className="dashboard-panel dashboard-panel-occupancy"
              aria-labelledby="occupancy-heading"
            >
              <div className="dashboard-panel-heading">
                <span className="section-icon">
                  <ChartPie size={20} aria-hidden />
                </span>
                <h2 id="occupancy-heading">Occupancy</h2>
                <span className="dashboard-panel-index" aria-hidden>
                  02
                </span>
              </div>
              <div className="dashboard-occupancy-value">
                <strong>
                  {percentage}
                  <span>%</span>
                </strong>
                <span>of resources occupied</span>
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
                  Occupied
                </span>
                <span>
                  <i className="legend-dot legend-free" />
                  Available
                </span>
              </div>
              <div className="dashboard-panel-details">
                {metric('occupied_resources')}
                {metric('available_resources')}
              </div>
              <p className="dashboard-panel-note">
                Shared rooms count as occupied while any contract is active.
              </p>
            </section>

            <section className="dashboard-panel" aria-labelledby="actions-heading">
              <div className="dashboard-panel-heading">
                <span className="section-icon">
                  <Wallet size={20} aria-hidden />
                </span>
                <h2 id="actions-heading">Rent & upcoming</h2>
                <span className="dashboard-panel-index" aria-hidden>
                  03
                </span>
              </div>
              <a
                className="dashboard-rent"
                href={link('/payments', { ...scope, metric: 'unpaid_rent_periods' })}
              >
                <span>Outstanding rent</span>
                <strong data-testid="outstanding-twd">
                  {formatTWD(data.counts.outstanding_twd)}
                </strong>
                <ArrowUpRight size={16} aria-hidden />
              </a>
              <div className="dashboard-panel-details">
                {metric('unpaid_rent_periods')}
                {metric('upcoming_contract_starts')}
                {metric('upcoming_contract_ends')}
                {metric('contracts_expiring')}
              </div>
              <p className="dashboard-panel-note">
                Balance includes partial and not-yet-due amounts.
              </p>
            </section>
          </div>
        </>
      )}
    </>
  );
}
