import './setup';
import { test, expect, afterEach } from 'bun:test';
import { renderHook, waitFor, cleanup, act } from '@testing-library/react';
import { useProperties } from '../VMs/properties.vm';
import { createQueryClient } from '../Services/query';
import { propertiesService, type PropertiesService } from '../Services/properties.service';
import type { PropertyList } from '../Generated/types.gen';
afterEach(cleanup);
test('property query exposes loading then an empty scoped list', async () => {
  let complete!: (data: PropertyList) => void;
  const service: PropertiesService = {
    ...propertiesService,
    list: () =>
      new Promise((resolve) => {
        complete = resolve;
      }),
  };
  const { result } = renderHook(() =>
    useProperties({}, undefined, service, createQueryClientStable),
  );
  expect(result.current.list.isPending).toBe(true);
  await act(async () =>
    complete({ items: [], total: 0, page: 1, page_size: 20, business_date: '2026-10-19' }),
  );
  await waitFor(() => expect(result.current.list.data?.total).toBe(0));
  expect(result.current.list.data?.items).toEqual([]);
});
const createQueryClientStable = createQueryClient();
test('property detail query exposes access errors without inventing a record', async () => {
  const service: PropertiesService = {
    ...propertiesService,
    list: async () => ({
      items: [],
      total: 0,
      page: 1,
      page_size: 20,
      business_date: '2026-10-19',
    }),
    detail: async () => {
      throw { message: 'Property access denied', status_code: 403 };
    },
  };
  const client = createQueryClient();
  const { result } = renderHook(() => useProperties({}, 'P003', service, client));
  await waitFor(() => expect(result.current.detail.isError).toBe(true));
  expect(result.current.detail.data).toBeUndefined();
});
