import { useRoute, link } from '../VMs/navigation.vm';
import { parsePaymentFilters } from '../Models/payment';
import type { SessionView } from '../Generated/types.gen';
import { PropertyFilter } from './shared/Collection';
import { Button } from './shared/Button';
import { PaymentPanel } from './PaymentPanel';
export function Payments({ session }: { session: SessionView }) {
  const route = useRoute();
  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">RENT LEDGER</p>
          <h1>Payments</h1>
          <p>Exact TWD obligations, recorded payments and append-only corrections.</p>
        </div>
      </div>
      <PropertyFilter session={session} path="/payments" query={route.query} />
      <div className="filters">
        <Button asChild variant="outline">
          <a href={link('/payments', { ...route.query, metric: undefined, page: '1' })}>
            All periods
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={link('/payments', { ...route.query, metric: 'unpaid_rent_periods', page: '1' })}>
            Outstanding rent
          </a>
        </Button>
        <label className="sr-only" htmlFor="payment-status">
          Payment status
        </label>
        <select
          id="payment-status"
          className="max-w-60"
          value={route.query.status || ''}
          onChange={(e) => {
            window.location.hash = link('/payments', {
              ...route.query,
              status: e.target.value || undefined,
              page: '1',
            }).slice(1);
          }}
        >
          <option value="">All payment statuses</option>
          {['Paid', 'Overdue', 'Partial Payment', 'Unpaid'].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
      <PaymentPanel
        session={session}
        query={parsePaymentFilters(route.query)}
        routeQuery={route.query}
      />
    </>
  );
}
