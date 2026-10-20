import { test, expect, beforeEach, afterAll } from 'bun:test';
import { fixtures } from '../fixtures';
import { domain } from '../domain';
import { StaysManager } from '../../Managers/stays-manager';
import { ListQuery } from '../../Src/Contracts/common.contract';
const d = domain(),
  m = new StaysManager(d.records);
beforeEach(fixtures);
afterAll(d.close);
test('contract projection preserves current/upcoming/ended history and exclusive boundaries', async () => {
  const owner = await d.access.actor('U001');
  const first = await m.list(owner, new ListQuery());
  expect(first.total).toBe(9);
  expect(first.items.filter((s: any) => s.status === 'Current').length).toBe(6);
  expect(first.items.find((s: any) => s.contract_id === 'C007')!.status).toBe('Upcoming');
  expect(first.items.find((s: any) => s.contract_id === 'C009')!.status).toBe('Ended');
  const onStart = await m.list(
    owner,
    Object.assign(new ListQuery(), { business_date: '2026-10-22' }),
  );
  expect(onStart.items.find((s: any) => s.contract_id === 'C007')!.status).toBe('Current');
  const onEnd = await m.list(
    owner,
    Object.assign(new ListQuery(), { business_date: '2026-10-24' }),
  );
  expect(onEnd.items.find((s: any) => s.contract_id === 'C006')!.status).toBe('Ended');
});
test('future termination leaves current occupancy until effective end; prestart cancellation occupies none', async () => {
  await d.db.contract.update({
    where: { id: 'C001' },
    data: { termination_date: new Date('2026-10-23') },
  });
  const owner = await d.access.actor('U001');
  expect(
    (await m.list(owner, new ListQuery())).items.find((s: any) => s.id === 'C001')!.status,
  ).toBe('Current');
  expect(
    (
      await m.list(owner, Object.assign(new ListQuery(), { business_date: '2026-10-23' }))
    ).items.find((s: any) => s.id === 'C001')!.status,
  ).toBe('Ended');
  await d.db.contract.update({
    where: { id: 'C007' },
    data: { termination_date: new Date('2026-10-20') },
  });
  expect(
    (
      await m.list(owner, Object.assign(new ListQuery(), { business_date: '2026-10-22' }))
    ).items.find((s: any) => s.id === 'C007')!.status,
  ).toBe('Ended');
});
