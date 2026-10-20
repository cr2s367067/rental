import { PaymentPanel } from './PaymentPanel';
import { useStays } from '../VMs/stays.vm';
import { useRoute, link } from '../VMs/navigation.vm';
import { parseFilters } from '../Models/filter';
import type { SessionView, StayView } from '../Generated/types.gen';
import { ResponsiveTable } from './shared/ResponsiveTable';
import { StatusBadge } from './shared/StatusBadge';
import { Feedback } from './shared/FormLayout';
import { PropertyFilter, Pagination } from './shared/Collection';
import { errorMessage } from '../Services/client';
export function StayTable({
  rows,
  context = {},
}: {
  rows: StayView[];
  context?: Record<string, string>;
}) {
  return (
    <ResponsiveTable
      label="Contract occupancy"
      headings={[
        'Contract',
        'Tenant',
        'Resource / property',
        'Effective term',
        'Occupancy',
        'Related files',
      ]}
    >
      {rows.map((s) => (
        <tr key={s.contract_id}>
          <td>
            <a href={link('/contracts/' + encodeURIComponent(s.contract_id), context)}>
              <strong>{s.contract_id}</strong>
            </a>
          </td>
          <td>
            <a href={link('/tenants/' + encodeURIComponent(s.tenant_id))}>{s.tenant_name}</a>
          </td>
          <td>
            <strong>{s.resource_name}</strong>
            <a href={link('/properties/' + encodeURIComponent(s.property_id))}>{s.property_name}</a>
          </td>
          <td>
            {s.start_date} → {s.effective_end_date}
            <small>
              End exclusive{s.termination_date ? ' · Termination ' + s.termination_date : ''}
            </small>
          </td>
          <td>
            <StatusBadge status={s.status} />
          </td>
          <td>
            <a
              href={link('/documents', {
                ...context,
                contract_id: s.contract_id,
                property_id: s.property_id,
              })}
              aria-label={'Files for ' + s.contract_id}
            >
              Files
            </a>
            <a
              className="block mt-2"
              href={link('/stays', {
                ...context,
                contract_id: s.contract_id,
                tenant_id: s.tenant_id,
                property_id: s.property_id,
              })}
              aria-label={'Rent periods for ' + s.contract_id}
            >
              Rent periods
            </a>
          </td>
        </tr>
      ))}
    </ResponsiveTable>
  );
}
export function Stays({ session }: { session: SessionView }) {
  const route = useRoute();
  const query = useStays(parseFilters(route.query));
  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">CONTRACT-DERIVED HISTORY</p>
          <h1>Contract occupancy</h1>
          <p>Current, upcoming and ended assignments follow effective contract dates.</p>
        </div>
      </div>
      <PropertyFilter session={session} path="/stays" query={route.query} />
      <Feedback pending={query.isPending} error={query.error ? errorMessage(query.error) : ''} />
      <div className="table-card">
        <StayTable rows={query.data?.items || []} context={route.query} />
        {query.data?.total === 0 && (
          <div className="empty">No contract assignments match these filters.</div>
        )}
        <Pagination data={query.data} path="/stays" query={route.query} />
      </div>
      {route.query.contract_id && (
        <div className="mt-6">
          <PaymentPanel
            session={session}
            query={{
              contract_id: route.query.contract_id,
              tenant_id: route.query.tenant_id,
              property_id: route.query.property_id,
              business_date: route.query.business_date,
            }}
          />
        </div>
      )}
    </>
  );
}
