import './setup';
import { test, expect, afterEach } from 'bun:test';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { ResponsiveDialog } from '../Views/shared/ResponsiveDialog';
import { ResponsiveTable } from '../Views/shared/ResponsiveTable';
import { Field } from '../Views/shared/FormLayout';
import { StatusBadge } from '../Views/shared/StatusBadge';
afterEach(cleanup);
test('responsive table keeps labeled headings and status meaning beyond color', () => {
  const ui = render(
    <ResponsiveTable label="Rent periods" headings={['Tenant', 'Status']}>
      <tr>
        <td>Demo tenant</td>
        <td>
          <StatusBadge status="Overdue" isPartial />
        </td>
      </tr>
    </ResponsiveTable>,
  );
  expect(ui.getByRole('region', { name: 'Rent periods' })).toBeTruthy();
  expect(ui.getByRole('columnheader', { name: 'Status' })).toBeTruthy();
  expect(ui.getByText('Overdue · Partial payment')).toBeTruthy();
});
test('accessible dialog labels and close action remain available', () => {
  let closed = false;
  const ui = render(
    <ResponsiveDialog
      open
      onOpenChange={(value) => {
        closed = !value;
      }}
      title="Edit property"
    >
      <button>Save</button>
    </ResponsiveDialog>,
  );
  expect(ui.getByRole('dialog', { name: 'Edit property' })).toBeTruthy();
  fireEvent.click(ui.getByLabelText('Close dialog'));
  expect(closed).toBe(true);
});

test('select field has an exact accessible label independent of option text', () => {
  const ui = render(
    <Field label="Role">
      <select>
        <option>Owner</option>
        <option>Manager</option>
      </select>
    </Field>,
  );
  expect(ui.getByLabelText('Role', { exact: true })).toBeTruthy();
});
