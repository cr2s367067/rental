import * as api from '../Generated/sdk.gen';
import type * as DTO from '../Generated/types.gen';
export const contractsService = {
  async list(query: DTO.ListContractsData['query'] = {}) {
    return (await api.listContracts({ query, throwOnError: true })).data;
  },
  async detail(id: string, query: DTO.GetContractData['query'] = {}) {
    return (await api.getContract({ path: { id }, query, throwOnError: true })).data;
  },
  async create(body: DTO.CreateContractData['body']) {
    return (await api.createContract({ body, throwOnError: true })).data;
  },
  async update(id: string, body: DTO.UpdateContractData['body']) {
    return (await api.updateContract({ path: { id }, body, throwOnError: true })).data;
  },
  async terminate(id: string, body: DTO.TerminateContractData['body']) {
    return (await api.terminateContract({ path: { id }, body, throwOnError: true })).data;
  },
  async documents(query: DTO.ListDocumentsData['query'] = {}) {
    return (await api.listDocuments({ query, throwOnError: true })).data;
  },
  async upload(body: DTO.UploadDocumentData['body']) {
    return (await api.uploadDocument({ body, throwOnError: true })).data;
  },
  async download(id: string) {
    return (await api.downloadDocument({ path: { id }, parseAs: 'blob', throwOnError: true })).data;
  },
};
export type ContractsService = typeof contractsService;
