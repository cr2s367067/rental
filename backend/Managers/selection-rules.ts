import type { RecordsManager } from './records-manager';
import type { ListQuery } from '../Src/Contracts/common.contract';
import type { ObligationQuery } from '../Src/Contracts/payment.contract';
import { upcoming } from './contract-rules';
type Dataset = Awaited<ReturnType<RecordsManager['dataset']>>;
export function selectResources(data: Dataset, q: Partial<ListQuery>) {
  return data.resources.filter(
    (r) =>
      (!q.resource_id || r.id === q.resource_id) &&
      (!q.tenant_id ||
        data.contracts.some((c) => c.resource_id === r.id && c.tenant_id === q.tenant_id)) &&
      (!q.contract_id ||
        data.contracts.some((c) => c.resource_id === r.id && c.id === q.contract_id)) &&
      (q.metric !== 'occupied_resources' || !r.available) &&
      (q.metric !== 'available_resources' || r.available),
  );
}
export function selectTenants(data: Dataset, q: Partial<ListQuery>) {
  return data.tenants.filter(
    (t) =>
      (!q.tenant_id || t.id === q.tenant_id) &&
      (!q.resource_id || t.contracts.some((c) => c.resource_id === q.resource_id)) &&
      (!q.contract_id || t.contracts.some((c) => c.id === q.contract_id)) &&
      (q.metric !== 'current_tenants' || t.contracts.some((c) => c.status === 'Current')),
  );
}
export function selectStays(data: Dataset, q: Partial<ListQuery>) {
  return data.stays.filter(
    (s) =>
      (!q.tenant_id || s.tenant_id === q.tenant_id) &&
      (!q.resource_id || s.resource_id === q.resource_id) &&
      (!q.contract_id || s.id === q.contract_id) &&
      (q.metric !== 'upcoming_contract_starts' ||
        (s.start_date < s.effective_end_date && upcoming(s.start_date, data.business_date))) &&
      (q.metric !== 'upcoming_contract_ends' ||
        (s.start_date < s.effective_end_date &&
          upcoming(s.effective_end_date, data.business_date))),
  );
}
export function selectContracts(data: Dataset, q: Partial<ListQuery>) {
  return data.contract_views.filter(
    (c) =>
      (!q.tenant_id || c.tenant_id === q.tenant_id) &&
      (!q.resource_id || c.resource_id === q.resource_id) &&
      (!q.contract_id || c.id === q.contract_id) &&
      (q.metric !== 'contracts_expiring' || c.status === 'Expiring Soon'),
  );
}
export function selectObligations(data: Dataset, q: Partial<ObligationQuery>) {
  return data.obligations.filter(
    (o) =>
      (!q.contract_id || o.contract_id === q.contract_id) &&
      (!q.tenant_id || o.tenant_id === q.tenant_id) &&
      (!q.resource_id || o.resource_id === q.resource_id) &&
      (q.metric !== 'unpaid_rent_periods' || BigInt(o.outstanding_twd) > 0n) &&
      (!q.status || o.status === q.status),
  );
}
