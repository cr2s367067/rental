import type { ListPropertiesData } from '../Generated/types.gen';
export function parseFilters(
  input: Record<string, string>,
): NonNullable<ListPropertiesData['query']> {
  return {
    property_id: input.property_id || undefined,
    tenant_id: input.tenant_id || undefined,
    resource_id: input.resource_id || undefined,
    contract_id: input.contract_id || undefined,
    business_date: input.business_date || undefined,
    metric: input.metric as NonNullable<ListPropertiesData['query']>['metric'],
    page: Math.max(1, Number(input.page) || 1),
    page_size: 20,
  };
}
