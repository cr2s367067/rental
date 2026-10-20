import { useMemo } from 'react';
import { useQuery, type QueryClient } from '@tanstack/react-query';
import { paymentsService, type PaymentsService } from '../Services/payments.service';
import type * as DTO from '../Generated/types.gen';
import { ActionVM, useActionVM } from './action.vm';
import { queryClient } from '../Services/query';
export class PaymentsVM extends ActionVM {
  constructor(
    private service: PaymentsService,
    invalidate: () => Promise<unknown>,
    private keyFactory: () => string = () => crypto.randomUUID(),
  ) {
    super(invalidate);
  }
  newIntent() {
    return this.keyFactory();
  }
  create(id: string, body: DTO.CreateObligationData['body']) {
    return this.run(() => this.service.create(id, body));
  }
  record(id: string, body: DTO.RecordPaymentData['body'], key: string) {
    return this.run(() => this.service.record(id, body, key));
  }
  reverse(id: string, body: DTO.ReversePaymentData['body'], key: string) {
    return this.run(() => this.service.reverse(id, body, key));
  }
}
export function usePayments(
  query: DTO.ListAllObligationsData['query'] = {},
  service: PaymentsService = paymentsService,
  client: QueryClient = queryClient,
) {
  const list = useQuery(
    { queryKey: ['obligations', query], queryFn: () => service.list(query) },
    client,
  );
  const actions = useActionVM(
    useMemo(() => new PaymentsVM(service, () => client.invalidateQueries()), [service, client]),
  );
  return { list, actions };
}
