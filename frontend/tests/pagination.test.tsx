import './setup';
import { test, expect, afterEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import { Pagination } from '../Views/shared/Collection';
afterEach(cleanup);
test('disabled pagination cannot navigate away; enabled links retain date and property filters', () => {
  const ui = render(
    <Pagination
      data={{ total: 1, page: 1, page_size: 20, business_date: '2026-10-19' }}
      path="/resources"
      query={{ property_id: 'P001', business_date: '2026-10-19', metric: 'available_resources' }}
    />,
  );
  const next = ui.getByRole('link', { name: 'Next' });
  expect(next.getAttribute('aria-disabled')).toBe('true');
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  next.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  expect(next.getAttribute('href')).toContain('business_date=2026-10-19');
  expect(next.getAttribute('href')).toContain('property_id=P001');
});
