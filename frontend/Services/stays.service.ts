import * as api from '../Generated/sdk.gen';
import type * as DTO from '../Generated/types.gen';
export const staysService = {
  async tenants(query: DTO.ListTenantsData['query'] = {}) {
    return (await api.listTenants({ query, throwOnError: true })).data;
  },
  async tenant(id: string, query: DTO.GetTenantData['query'] = {}) {
    return (await api.getTenant({ path: { id }, query, throwOnError: true })).data;
  },
  async stays(query: DTO.ListStaysData['query'] = {}) {
    return (await api.listStays({ query, throwOnError: true })).data;
  },
  async create(body: DTO.CreateTenantData['body']) {
    return (await api.createTenant({ body, throwOnError: true })).data;
  },
  async update(id: string, body: DTO.UpdateTenantData['body']) {
    return (await api.updateTenant({ path: { id }, body, throwOnError: true })).data;
  },
};
export type StaysService = typeof staysService;
