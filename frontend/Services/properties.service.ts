import * as api from '../Generated/sdk.gen';
import type * as DTO from '../Generated/types.gen';
export const propertiesService = {
  async list(query: DTO.ListPropertiesData['query'] = {}) {
    return (await api.listProperties({ query, throwOnError: true })).data;
  },
  async detail(id: string, query: DTO.GetPropertyData['query'] = {}) {
    return (await api.getProperty({ path: { id }, query, throwOnError: true })).data;
  },
  async resources(query: DTO.ListAllResourcesData['query'] = {}) {
    return (await api.listAllResources({ query, throwOnError: true })).data;
  },
  async create(body: DTO.CreatePropertyData['body']) {
    return (await api.createProperty({ body, throwOnError: true })).data;
  },
  async update(id: string, body: DTO.UpdatePropertyData['body']) {
    return (await api.updateProperty({ path: { id }, body, throwOnError: true })).data;
  },
  async createResource(id: string, body: DTO.CreateResourceData['body']) {
    return (await api.createResource({ path: { id }, body, throwOnError: true })).data;
  },
  async updateResource(id: string, body: DTO.UpdateResourceData['body']) {
    return (await api.updateResource({ path: { id }, body, throwOnError: true })).data;
  },
};
export type PropertiesService = typeof propertiesService;
