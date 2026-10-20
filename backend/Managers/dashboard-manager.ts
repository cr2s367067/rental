import { Injectable } from '@nestjs/common';
import { RecordsManager } from './records-manager';
import type { Actor } from '../Src/Infrastructure/access';
import {
  DashboardQuery,
  DashboardView,
  DashboardCounts,
  metricDefinitions,
  type MetricKey,
} from '../Src/Contracts/dashboard.contract';
import { ListQuery } from '../Src/Contracts/common.contract';
import {
  selectResources,
  selectTenants,
  selectStays,
  selectContracts,
  selectObligations,
} from './selection-rules';
@Injectable()
export class DashboardManager {
  constructor(private records: RecordsManager) {}
  async get(actor: Actor, query: DashboardQuery): Promise<DashboardView> {
    const data = await this.records.dataset(actor, Object.assign(new ListQuery(), query));
    const outstanding = selectObligations(data, { metric: 'unpaid_rent_periods' });
    const counts: DashboardCounts = {
      total_properties: data.properties.length,
      total_resources: data.resources.length,
      occupied_resources: selectResources(data, { metric: 'occupied_resources' }).length,
      available_resources: selectResources(data, { metric: 'available_resources' }).length,
      current_tenants: selectTenants(data, { metric: 'current_tenants' }).length,
      upcoming_contract_starts: selectStays(data, { metric: 'upcoming_contract_starts' }).length,
      upcoming_contract_ends: selectStays(data, { metric: 'upcoming_contract_ends' }).length,
      unpaid_rent_periods: outstanding.length,
      contracts_expiring: selectContracts(data, { metric: 'contracts_expiring' }).length,
      outstanding_twd: outstanding
        .reduce((sum, o) => sum + BigInt(o.outstanding_twd), 0n)
        .toString(),
      document_metadata_count: data.document_metadata_count,
    };
    const metrics = (Object.keys(metricDefinitions) as MetricKey[]).map((key) => ({
      key,
      ...metricDefinitions[key],
      count: counts[key],
      query: {
        business_date: data.business_date,
        metric: key,
        ...(query.property_id ? { property_id: query.property_id } : {}),
      },
    }));
    return {
      business_date: data.business_date,
      timezone: 'Asia/Taipei',
      property_id: query.property_id || null,
      counts,
      metrics,
    };
  }
}
