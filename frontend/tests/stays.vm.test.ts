import { test, expect } from 'bun:test';
import { StaysVM } from '../VMs/stays.vm';
import { staysService, type StaysService } from '../Services/stays.service';
const tenant = { id: 'T1', name: 'Edited', email: null, phone: null, version: 2, contracts: [] };
test('contact update refreshes scoped history and resource queries', async () => {
  let refreshed = 0;
  const service: StaysService = { ...staysService, update: async () => tenant };
  const vm = new StaysVM(service, async () => {
    refreshed++;
  });
  expect(await vm.update('T1', { version: 1, name: 'Edited' })).toEqual(tenant);
  expect(refreshed).toBe(1);
});
test('outscope/invalid contact error retains form input', async () => {
  const input = { version: 1, name: 'Retained' };
  const vm = new StaysVM(
    {
      ...staysService,
      update: async () => {
        throw { message: 'Tenant access denied' };
      },
    },
    async () => {},
  );
  await vm.update('T1', input);
  expect(vm.error).toBe('Tenant access denied');
  expect(input.name).toBe('Retained');
});
