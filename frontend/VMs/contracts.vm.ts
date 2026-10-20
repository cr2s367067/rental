import { useMemo } from 'react';
import { useQuery, type QueryClient } from '@tanstack/react-query';
import { contractsService, type ContractsService } from '../Services/contracts.service';
import type * as DTO from '../Generated/types.gen';
import { ActionVM, useActionVM } from './action.vm';
import { queryClient } from '../Services/query';
export class ContractsVM extends ActionVM {
  constructor(
    private service: ContractsService,
    invalidate: () => Promise<unknown>,
  ) {
    super(invalidate);
  }
  create(body: DTO.CreateContractData['body']) {
    return this.run(() => this.service.create(body));
  }
  update(id: string, body: DTO.UpdateContractData['body']) {
    return this.run(() => this.service.update(id, body));
  }
  terminate(id: string, body: DTO.TerminateContractData['body']) {
    return this.run(() => this.service.terminate(id, body));
  }
  upload(body: DTO.UploadDocumentData['body']) {
    return this.run(() => this.service.upload(body));
  }
  download(id: string) {
    return this.run(() => this.service.download(id), false);
  }
}
export function useContracts(
  query: DTO.ListContractsData['query'] = {},
  id?: string,
  service: ContractsService = contractsService,
  client: QueryClient = queryClient,
) {
  const list = useQuery(
    { queryKey: ['contracts', query], queryFn: () => service.list(query) },
    client,
  );
  const detail = useQuery(
    { queryKey: ['contract', id, query], queryFn: () => service.detail(id!, query), enabled: !!id },
    client,
  );
  const actions = useActionVM(
    useMemo(() => new ContractsVM(service, () => client.invalidateQueries()), [service, client]),
  );
  return { list, detail, actions };
}
export function useDocuments(
  query: DTO.ListDocumentsData['query'] = {},
  service: ContractsService = contractsService,
  client: QueryClient = queryClient,
) {
  const list = useQuery(
    { queryKey: ['documents', query], queryFn: () => service.documents(query) },
    client,
  );
  const actions = useActionVM(
    useMemo(() => new ContractsVM(service, () => client.invalidateQueries()), [service, client]),
  );
  return { list, actions };
}
