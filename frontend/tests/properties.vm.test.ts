import { test, expect } from 'bun:test';
import { PropertiesVM } from '../VMs/properties.vm';
import type { PropertiesService } from '../Services/properties.service';
const property = {
  id: 'P1',
  name: 'House',
  city: 'Taipei',
  address: 'Demo',
  owner_user_id: 'U1',
  owner_name: 'Owner',
  rental_mode: 'ROOMS' as const,
  version: 1,
  resources: [],
};
const resource = {
  id: 'R1',
  name: 'Room',
  property_id: 'P1',
  property_name: 'House',
  kind: 'ROOM' as const,
  capacity: 1,
  version: 1,
  current_count: 0,
  available_slots: 1,
  available: true,
  occupants: [],
};
const service: PropertiesService = {
  list: async () => ({
    items: [property],
    total: 1,
    page: 1,
    page_size: 20,
    business_date: '2026-10-19',
  }),
  detail: async () => property,
  resources: async () => ({
    items: [resource],
    total: 1,
    page: 1,
    page_size: 20,
    business_date: '2026-10-19',
  }),
  create: async () => property,
  update: async () => property,
  createResource: async () => resource,
  updateResource: async () => resource,
};
test('property save returns result and refreshes related server data', async () => {
  let refreshed = 0;
  const vm = new PropertiesVM(service, async () => {
    refreshed++;
  });
  expect(
    await vm.create({
      name: 'House',
      city: 'Taipei',
      address: 'Demo',
      owner_user_id: 'U1',
      rental_mode: 'ROOMS',
    }),
  ).toEqual(property);
  expect(refreshed).toBe(1);
  expect(vm.pending).toBe(false);
});
test('capacity conflict retains form values and actionable feedback', async () => {
  const input = { version: 1, capacity: 1 };
  const vm = new PropertiesVM(
    {
      ...service,
      updateResource: async () => {
        throw { message: 'Contract terms exceed capacity' };
      },
    },
    async () => {},
  );
  await vm.updateResource('R1', input);
  expect(vm.error).toBe('Contract terms exceed capacity');
  expect(input.capacity).toBe(1);
});
