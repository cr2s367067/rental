import { useMemo } from 'react';
import { useQuery, type QueryClient } from '@tanstack/react-query';
import { propertiesService, type PropertiesService } from '../Services/properties.service';
import type * as DTO from '../Generated/types.gen';
import { ActionVM, useActionVM } from './action.vm';
import { queryClient } from '../Services/query';
export class PropertiesVM extends ActionVM {
  constructor(
    private service: PropertiesService,
    invalidate: () => Promise<unknown>,
  ) {
    super(invalidate);
  }
  create(body: DTO.CreatePropertyData['body']) {
    return this.run(() => this.service.create(body));
  }
  update(id: string, body: DTO.UpdatePropertyData['body']) {
    return this.run(() => this.service.update(id, body));
  }
  createResource(id: string, body: DTO.CreateResourceData['body']) {
    return this.run(() => this.service.createResource(id, body));
  }
  updateResource(id: string, body: DTO.UpdateResourceData['body']) {
    return this.run(() => this.service.updateResource(id, body));
  }
}
export function useProperties(
  query: DTO.ListPropertiesData['query'] = {},
  id?: string,
  service: PropertiesService = propertiesService,
  client: QueryClient = queryClient,
) {
  const list = useQuery(
    { queryKey: ['properties', query], queryFn: () => service.list(query) },
    client,
  );
  const detail = useQuery(
    {
      queryKey: ['property', id, query.business_date],
      queryFn: () => service.detail(id!, query),
      enabled: !!id,
    },
    client,
  );
  const actions = useActionVM(
    useMemo(() => new PropertiesVM(service, () => client.invalidateQueries()), [service, client]),
  );
  return { list, detail, actions };
}
export function useResources(
  query: DTO.ListAllResourcesData['query'] = {},
  service: PropertiesService = propertiesService,
  client: QueryClient = queryClient,
) {
  const list = useQuery(
    { queryKey: ['resources', query], queryFn: () => service.resources(query) },
    client,
  );
  const actions = useActionVM(
    useMemo(() => new PropertiesVM(service, () => client.invalidateQueries()), [service, client]),
  );
  return { list, actions };
}
