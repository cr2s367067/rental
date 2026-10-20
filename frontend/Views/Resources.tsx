import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResources, useProperties, type PropertiesVM } from '../VMs/properties.vm';
import { useRoute, link } from '../VMs/navigation.vm';
import { parseFilters } from '../Models/filter';
import {
  resourceFormSchema,
  type ResourceFormValues,
  type ResourceView,
  type PropertyView,
} from '../Models/property';
import type { SessionView } from '../Generated/types.gen';
import { Button } from './shared/Button';
import { ResponsiveDialog } from './shared/ResponsiveDialog';
import { ResponsiveTable } from './shared/ResponsiveTable';
import { StatusBadge } from './shared/StatusBadge';
import { Field, FormLayout, Feedback } from './shared/FormLayout';
import { PropertyFilter, Pagination } from './shared/Collection';
import { errorMessage } from '../Services/client';
function ResourceForm({
  resource,
  property,
  vm,
  done,
}: {
  resource: ResourceView | null;
  property: PropertyView;
  vm: PropertiesVM;
  done: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      name: resource?.name || '',
      capacity: resource?.capacity || 1,
      kind: resource?.kind || (property.rental_mode === 'ROOMS' ? 'ROOM' : 'WHOLE_PROPERTY'),
    },
  });
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        const saved = resource
          ? await vm.updateResource(resource.id, {
              name: v.name,
              capacity: v.capacity,
              version: resource.version,
            })
          : await vm.createResource(property.id, v);
        if (saved) done();
      })}
    >
      <FormLayout>
        <Field label="Resource name" error={errors.name?.message}>
          <input {...register('name')} />
        </Field>
        <Field label="Capacity" error={errors.capacity?.message}>
          <input
            type="number"
            min="1"
            max="1000"
            {...register('capacity', { valueAsNumber: true })}
          />
        </Field>
      </FormLayout>
      <p>
        {property.rental_mode === 'ROOMS' ? 'Room rental' : 'Whole-property rental'} · One capacity
        slot per active contract.
      </p>
      <Feedback error={vm.error} />
      <Button disabled={vm.pending}>Save resource</Button>
    </form>
  );
}
export function Resources({ session }: { session: SessionView }) {
  const route = useRoute(),
    { list, actions } = useResources(parseFilters(route.query));
  const properties = useProperties({ page_size: 100 }).list;
  const [editing, setEditing] = useState<ResourceView | null | undefined>(),
    [propertyId, setPropertyId] = useState(route.query.property_id || '');
  const canWrite = session.user.role !== 'VIEWER';
  const property =
    properties.data?.items.find((p) => p.id === (editing?.property_id || propertyId)) ||
    properties.data?.items[0];
  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">RENTABLE SPACES</p>
          <h1>Resources</h1>
          <p>Availability follows effective contract dates. Shared rooms expose free slots.</p>
        </div>
        {canWrite && <Button onClick={() => setEditing(null)}>Add resource</Button>}
      </div>
      <PropertyFilter session={session} path="/resources" query={route.query} />
      <Feedback pending={list.isPending} error={list.error ? errorMessage(list.error) : ''} />
      <div className="table-card">
        <ResponsiveTable
          label="Resources"
          headings={[
            'Resource',
            'Property',
            'Current occupants',
            'Capacity',
            'Availability',
            'Actions',
          ]}
        >
          {list.data?.items.map((r) => (
            <tr key={r.id}>
              <td>
                <strong>{r.name}</strong>
                <small>{r.kind === 'ROOM' ? 'Room' : 'Whole property'}</small>
              </td>
              <td>
                <a href={link('/properties/' + encodeURIComponent(r.property_id), route.query)}>
                  {r.property_name}
                </a>
              </td>
              <td>
                {r.occupants.map((o) => (
                  <a
                    className="block"
                    key={o.contract_id}
                    href={link('/contracts/' + encodeURIComponent(o.contract_id), route.query)}
                  >
                    {o.tenant_name}
                  </a>
                ))}
                {!r.occupants.length && <span>—</span>}
              </td>
              <td>
                {r.current_count} / {r.capacity}
                <small>{r.available_slots} free slots</small>
              </td>
              <td>
                <StatusBadge status={r.available ? 'Available' : 'Occupied'} />
              </td>
              <td>
                {canWrite && (
                  <Button variant="outline" onClick={() => setEditing(r)}>
                    Edit {r.name}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </ResponsiveTable>
        {list.data?.total === 0 && <div className="empty">No resources match these filters.</div>}
        <Pagination data={list.data} path="/resources" query={route.query} />
      </div>
      <ResponsiveDialog
        open={editing !== undefined}
        onOpenChange={(v) => {
          if (!v) setEditing(undefined);
        }}
        title={editing ? 'Edit resource' : 'Add resource'}
      >
        {!editing && (
          <Field label="Property">
            <select value={property?.id || ''} onChange={(e) => setPropertyId(e.target.value)}>
              {properties.data?.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        {property && editing !== undefined && (
          <ResourceForm
            key={(editing?.id || 'new') + property.id}
            resource={editing}
            property={property}
            vm={actions}
            done={() => setEditing(undefined)}
          />
        )}
      </ResponsiveDialog>
    </>
  );
}
