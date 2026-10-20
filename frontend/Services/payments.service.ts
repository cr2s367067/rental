import * as api from '../Generated/sdk.gen';
import type * as DTO from '../Generated/types.gen';
export const paymentsService = {
  async list(query: DTO.ListAllObligationsData['query'] = {}) {
    return (await api.listAllObligations({ query, throwOnError: true })).data;
  },
  async create(contract_id: string, body: DTO.CreateObligationData['body']) {
    return (await api.createObligation({ path: { id: contract_id }, body, throwOnError: true }))
      .data;
  },
  async record(id: string, body: DTO.RecordPaymentData['body'], key: string) {
    return (
      await api.recordPayment({
        path: { id },
        body,
        headers: { 'Idempotency-Key': key },
        throwOnError: true,
      })
    ).data;
  },
  async reverse(id: string, body: DTO.ReversePaymentData['body'], key: string) {
    return (
      await api.reversePayment({
        path: { id },
        body,
        headers: { 'Idempotency-Key': key },
        throwOnError: true,
      })
    ).data;
  },
};
export type PaymentsService = typeof paymentsService;
