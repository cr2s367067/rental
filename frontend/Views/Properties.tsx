import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProperties, type PropertiesVM } from '../VMs/properties.vm';
import { useUsers } from '../VMs/users.vm';
import { useRoute, link } from '../VMs/navigation.vm';
import { parseFilters } from '../Models/filter';
import { propertyFormSchema, type PropertyFormValues, type PropertyView } from '../Models/property';
import type { SessionView, UserView } from '../Generated/types.gen';
import { Button } from './shared/Button';
import { ResponsiveDialog } from './shared/ResponsiveDialog';
import { ResponsiveTable } from './shared/ResponsiveTable';
import { Field, FormLayout, Feedback } from './shared/FormLayout';
import { PropertyFilter, Pagination } from './shared/Collection';
import { errorMessage } from '../Services/client';
function PropertyForm({
  property,
  session,
  owners,
  vm,
  done,
}: {
  property: PropertyView | null;
  session: SessionView;
  owners: UserView[];
  vm: PropertiesVM;
  done: () => void;
}) {
  const owner = session.user.role === 'OWNER';
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: property?.name || '',
      city: property?.city || '',
      address: property?.address || '',
      owner_user_id: property?.owner_user_id || session.user.id,
      rental_mode: property?.rental_mode || 'ROOMS',
    },
  });
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        const body = owner ? v : { name: v.name, city: v.city, address: v.address };
        const saved = property
          ? await vm.update(property.id, { ...body, version: property.version })
          : await vm.create(v);
        if (saved) done();
      })}
    >
      <FormLayout>
        <Field label="Property name" error={errors.name?.message}>
          <input {...register('name')} />
        </Field>
        <Field label="City" error={errors.city?.message}>
          <input {...register('city')} />
        </Field>
        <Field label="Address" error={errors.address?.message}>
          <input {...register('address')} />
        </Field>
        {owner && (
          <>
            <Field label="Owner">
              <select {...register('owner_user_id')}>
                {owners
                  .filter((u) => u.enabled && u.role === 'OWNER')
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.display_name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Rental mode">
              <select {...register('rental_mode')} disabled={!!property?.resources.length}>
                <option value="ROOMS">Rooms</option>
                <option value="WHOLE_PROPERTY">Whole property</option>
              </select>
            </Field>
            {!!property?.resources.length && <p>Rental mode must match the existing resources.</p>}
          </>
        )}
      </FormLayout>
      <Feedback error={vm.error} />
      <div className="form-actions">
        <Button disabled={vm.pending}>Save property</Button>
      </div>
    </form>
  );
}
export function Properties({ session, id }: { session: SessionView; id?: string }) {
  const route = useRoute(),
    filters = parseFilters(route.query);
  const { list, detail, actions } = useProperties(filters, id);
  const users = useUsers(session.user.role === 'OWNER');
  const [editing, setEditing] = useState<PropertyView | null | undefined>();
  const canWrite = session.user.role !== 'VIEWER';
  const selected = detail.data;
  const result = id ? detail : list;
  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">PORTFOLIO</p>
          <h1>{id ? selected?.name || 'Property' : 'Properties'}</h1>
          <p>{id ? selected?.address : 'Your properties, resources and occupancy in one place.'}</p>
        </div>
        <div className="actions">
          {id && selected && canWrite && (
            <Button onClick={() => setEditing(selected)}>Edit property</Button>
          )}
          {!id && session.user.role === 'OWNER' && (
            <Button onClick={() => setEditing(null)}>Add property</Button>
          )}
        </div>
      </div>
      <Feedback pending={result.isPending} error={result.error ? errorMessage(result.error) : ''} />
      {id && selected ? (
        <>
          <div className="detail-grid">
            <section className="card">
              <h2>Property details</h2>
              <dl>
                <dt>City</dt>
                <dd>{selected.city}</dd>
                <dt>Rental mode</dt>
                <dd>{selected.rental_mode === 'ROOMS' ? 'Rooms' : 'Whole property'}</dd>
                <dt>Owner</dt>
                <dd>{selected.owner_name}</dd>
                <dt>Resources</dt>
                <dd>{selected.resources.length}</dd>
              </dl>
              <Button asChild variant="outline">
                <a href={link('/resources', { ...route.query, property_id: id })}>
                  Manage resources
                </a>
              </Button>
              <div className="actions mt-4">
                <a href={link('/contracts', { ...route.query, property_id: selected.id })}>
                  Contracts for property
                </a>
                <a href={link('/documents', { ...route.query, property_id: selected.id })}>
                  Property documents
                </a>
              </div>
            </section>
            <section className="card">
              <h2>Current occupancy</h2>
              <p>
                {selected.resources.filter((r) => !r.available).length} occupied ·{' '}
                {selected.resources.filter((r) => r.available).length} available
              </p>
              <p>Capacity and occupants follow effective contract terms.</p>
            </section>
          </div>
          <div className="table-card">
            <ResponsiveTable
              label="Property resources"
              headings={['Resource', 'Occupants', 'Capacity']}
            >
              {selected.resources.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>
                    {r.occupants.length
                      ? r.occupants.map((o) => (
                          <a
                            className="block"
                            key={o.contract_id}
                            href={link(
                              '/contracts/' + encodeURIComponent(o.contract_id),
                              route.query,
                            )}
                          >
                            {o.tenant_name}
                          </a>
                        ))
                      : 'Available'}
                  </td>
                  <td>
                    {r.current_count} / {r.capacity}
                  </td>
                </tr>
              ))}
            </ResponsiveTable>
          </div>
        </>
      ) : (
        !id && (
          <>
            <PropertyFilter session={session} path="/properties" query={route.query} />
            <div className="table-card">
              <ResponsiveTable
                label="Properties"
                headings={['Property', 'Rental mode', 'Resources', 'Owner', 'Actions']}
              >
                {list.data?.items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <a href={link('/properties/' + encodeURIComponent(p.id), route.query)}>
                        <strong>{p.name}</strong>
                      </a>
                      <small>
                        {p.city} · {p.address}
                      </small>
                    </td>
                    <td>{p.rental_mode === 'ROOMS' ? 'Rooms' : 'Whole property'}</td>
                    <td>
                      {p.resources.length}
                      <small>{p.resources.filter((r) => !r.available).length} occupied</small>
                    </td>
                    <td>{p.owner_name}</td>
                    <td>
                      {canWrite && (
                        <Button variant="outline" onClick={() => setEditing(p)}>
                          Edit {p.name}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </ResponsiveTable>
              {list.data?.total === 0 && <div className="empty">No properties in this scope.</div>}
              <Pagination data={list.data} path="/properties" query={route.query} />
            </div>
          </>
        )
      )}
      <ResponsiveDialog
        open={editing !== undefined}
        onOpenChange={(v) => {
          if (!v) setEditing(undefined);
        }}
        title={editing ? 'Edit property' : 'Add property'}
      >
        {editing !== undefined && (
          <PropertyForm
            key={editing?.id || 'new'}
            property={editing}
            session={session}
            owners={users.query.data?.items || []}
            vm={actions}
            done={() => setEditing(undefined)}
          />
        )}
      </ResponsiveDialog>
    </>
  );
}
