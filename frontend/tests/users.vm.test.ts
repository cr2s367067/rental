import { test, expect } from 'bun:test';
import { UsersVM } from '../VMs/users.vm';
import type { UsersService } from '../Services/users.service';
const user = {
  id: 'U4',
  email: 'x@example.test',
  display_name: 'X',
  role: 'VIEWER' as const,
  enabled: true,
  version: 1,
  property_ids: [],
};
function service(overrides: Partial<UsersService> = {}): UsersService {
  return {
    list: async () => ({
      items: [user],
      total: 1,
      page: 1,
      page_size: 100,
      business_date: '2026-10-19',
    }),
    create: async () => user,
    update: async () => user,
    password: async () => ({ ok: true }),
    grants: async () => user,
    owner: async () => ({ id: 'P1', name: 'Property', owner_user_id: 'U1', version: 2 }),
    date: async (business_date) => ({ business_date, timezone: 'Asia/Taipei', demo_mode: true }),
    reset: async () => ({ ok: true }),
    ...overrides,
  };
}
test('role creation uses injected generated service and invalidates server context', async () => {
  let refreshed = 0;
  const vm = new UsersVM(service(), async () => {
    refreshed++;
  });
  const result = await vm.create({
    email: user.email,
    display_name: 'X',
    password: 'twelve-characters',
    role: 'VIEWER',
    enabled: true,
  });
  expect(result).toEqual(user);
  expect(refreshed).toBe(1);
  expect(vm.pending).toBe(false);
});
test('denied/conflicting grants show actionable error and retain input', async () => {
  const input = { version: 1, property_ids: ['P1'] };
  const vm = new UsersVM(
    service({
      grants: async () => {
        throw { message: 'Record changed. Refresh' };
      },
    }),
    async () => {},
  );
  await vm.grants('U4', input);
  expect(vm.error).toBe('Record changed. Refresh');
  expect(input.property_ids).toEqual(['P1']);
  expect(vm.pending).toBe(false);
});
