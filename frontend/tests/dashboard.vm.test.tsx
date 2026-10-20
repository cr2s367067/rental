import './setup';
import { test, expect, afterEach } from 'bun:test';
import { renderHook, waitFor, cleanup, act } from '@testing-library/react';
import { metricLinks, useDashboard } from '../VMs/dashboard.vm';
import { createQueryClient } from '../Services/query';
import type { DashboardView } from '../Generated/types.gen';
const data: DashboardView = {
  business_date: '2026-10-19',
  timezone: 'Asia/Taipei',
  property_id: 'P001',
  counts: {
    total_properties: 1,
    total_resources: 4,
    occupied_resources: 3,
    available_resources: 1,
    current_tenants: 4,
    upcoming_contract_starts: 1,
    upcoming_contract_ends: 1,
    unpaid_rent_periods: 3,
    outstanding_twd: '54000',
    contracts_expiring: 2,
    document_metadata_count: 7,
  },
  metrics: [
    {
      key: 'available_resources',
      count: 1,
      label: 'Available resources',
      description: 'No active contracts',
      path: '/resources',
      query: { metric: 'available_resources', business_date: '2026-10-19', property_id: 'P001' },
    },
  ],
};
afterEach(cleanup);
test('metric links preserve server count and identical date/property/filter context', () => {
  const links = metricLinks(data);
  expect(links).toHaveLength(1);
  expect(links[0].count).toBe(1);
  const url = new URL(links[0].href.slice(1), 'http://rental.local');
  expect(url.pathname).toBe('/resources');
  expect(url.searchParams.get('property_id')).toBe('P001');
  expect(url.searchParams.get('business_date')).toBe('2026-10-19');
  expect(url.searchParams.get('metric')).toBe('available_resources');
});
test('dashboard VM exposes loading, data and scope changes through injected generated service', async () => {
  let complete!: (v: DashboardView) => void;
  const calls: string[] = [];
  const service = {
    read: async (q?: { property_id?: string }) => {
      calls.push(q?.property_id || '');
      return new Promise<DashboardView>((resolve) => {
        complete = resolve;
      });
    },
  };
  const client = createQueryClient(),
    { result, rerender } = renderHook(
      ({ property_id }) => useDashboard({ property_id }, service, client),
      { initialProps: { property_id: 'P001' } },
    );
  expect(result.current.isPending).toBe(true);
  await act(async () => complete(data));
  await waitFor(() => expect(result.current.data?.counts.outstanding_twd).toBe('54000'));
  rerender({ property_id: 'P002' });
  await waitFor(() => expect(calls).toEqual(['P001', 'P002']));
});
test('dashboard VM keeps empty zeros and error state explicit', async () => {
  const client = createQueryClient();
  const empty = {
    ...data,
    property_id: null,
    counts: {
      ...data.counts,
      total_properties: 0,
      total_resources: 0,
      occupied_resources: 0,
      available_resources: 0,
      current_tenants: 0,
      upcoming_contract_starts: 0,
      upcoming_contract_ends: 0,
      unpaid_rent_periods: 0,
      outstanding_twd: '0',
      contracts_expiring: 0,
      document_metadata_count: 0,
    },
    metrics: [],
  };
  const { result } = renderHook(() => useDashboard({}, { read: async () => empty }, client));
  await waitFor(() => expect(result.current.data?.counts.total_properties).toBe(0));
  const badClient = createQueryClient();
  const failed = renderHook(() =>
    useDashboard(
      {},
      {
        read: async () => {
          throw { message: 'Property access denied' };
        },
      },
      badClient,
    ),
  );
  await waitFor(() => expect(failed.result.current.isError).toBe(true));
});
