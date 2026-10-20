import { useMemo } from 'react';
import { useQuery, type QueryClient } from '@tanstack/react-query';
import { staysService, type StaysService } from '../Services/stays.service';
import type * as DTO from '../Generated/types.gen';
import { ActionVM, useActionVM } from './action.vm';
import { queryClient } from '../Services/query';
export class StaysVM extends ActionVM {
  constructor(
    private service: StaysService,
    invalidate: () => Promise<unknown>,
  ) {
    super(invalidate);
  }
  update(id: string, body: DTO.UpdateTenantData['body']) {
    return this.run(() => this.service.update(id, body));
  }
  create(body: DTO.CreateTenantData['body']) {
    return this.run(() => this.service.create(body));
  }
}
export function useTenants(
  query: DTO.ListTenantsData['query'] = {},
  id?: string,
  service: StaysService = staysService,
  client: QueryClient = queryClient,
) {
  const list = useQuery(
    { queryKey: ['tenants', query], queryFn: () => service.tenants(query) },
    client,
  );
  const detail = useQuery(
    { queryKey: ['tenant', id, query], queryFn: () => service.tenant(id!, query), enabled: !!id },
    client,
  );
  const actions = useActionVM(
    useMemo(() => new StaysVM(service, () => client.invalidateQueries()), [service, client]),
  );
  return { list, detail, actions };
}
export function useStays(
  query: DTO.ListStaysData['query'] = {},
  service: StaysService = staysService,
  client: QueryClient = queryClient,
) {
  return useQuery({ queryKey: ['stays', query], queryFn: () => service.stays(query) }, client);
}
