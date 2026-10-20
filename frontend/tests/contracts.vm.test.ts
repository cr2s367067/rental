import { test, expect } from 'bun:test';
import { ContractsVM } from '../VMs/contracts.vm';
import { contractsService, type ContractsService } from '../Services/contracts.service';
const contract = {
  id: 'C1',
  contract_id: 'C1',
  tenant_id: 'T1',
  tenant_name: 'Atomic',
  resource_id: 'R1',
  resource_name: 'Room',
  property_id: 'P1',
  property_name: 'House',
  start_date: '2026-10-19',
  end_date: '2027-10-19',
  effective_end_date: '2027-10-19',
  termination_date: null,
  status: 'Active' as const,
  monthly_rent_twd: '10000',
  deposit_twd: '20000',
  due_day: 1,
  primary_document_id: null,
  version: 1,
};
test('atomic new-contact contract save refreshes occupancy/history queries', async () => {
  let refreshed = 0;
  const service: ContractsService = { ...contractsService, create: async () => contract };
  const vm = new ContractsVM(service, async () => {
    refreshed++;
  });
  expect(
    await vm.create({
      resource_id: 'R1',
      new_tenant: { name: 'Atomic' },
      start_date: '2026-10-19',
      end_date: '2027-10-19',
      monthly_rent_twd: '10000',
      deposit_twd: '20000',
      due_day: 1,
    }),
  ).toEqual(contract);
  expect(refreshed).toBe(1);
});
test('upload denial keeps file/context and explains feedback', async () => {
  const body = {
    kind: 'CONTRACT' as const,
    property_id: 'P1',
    contract_id: 'C1',
    file: new Blob(['demo'], { type: 'text/plain' }),
  };
  const vm = new ContractsVM(
    {
      ...contractsService,
      upload: async () => {
        throw { message: 'File contents do not match MIME type' };
      },
    },
    async () => {},
  );
  await vm.upload(body);
  expect(vm.error).toContain('MIME');
  expect(body.contract_id).toBe('C1');
  expect(body.file.size).toBe(4);
});
test('binary download returns Blob through generated service without putting contents in query caches', async () => {
  const blob = new Blob(['unchanged']);
  let refreshed = 0;
  const vm = new ContractsVM({ ...contractsService, download: async () => blob }, async () => {
    refreshed++;
  });
  expect(await vm.download('D1')).toBe(blob);
  expect(refreshed).toBe(0);
});
