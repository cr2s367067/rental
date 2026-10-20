import type { CreateTenantInput } from '../Src/Contracts/stay.contract';
import { invalid } from '../Src/Infrastructure/rules';
export function tenantContact(input: CreateTenantInput) {
  if (!input.name.trim()) invalid('Enter a tenant name');
  return {
    name: input.name.trim(),
    email: input.email?.trim().toLowerCase() || null,
    phone: input.phone?.trim() || null,
  };
}
