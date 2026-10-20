import { PaymentPanel } from './PaymentPanel';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTenants, type StaysVM } from '../VMs/stays.vm';
import { useRoute, link } from '../VMs/navigation.vm';
import { parseFilters } from '../Models/filter';
import { contactFormSchema, type ContactFormValues, type TenantView } from '../Models/stay';
import type { SessionView } from '../Generated/types.gen';
import { Button } from './shared/Button';
import { ResponsiveDialog } from './shared/ResponsiveDialog';
import { ResponsiveTable } from './shared/ResponsiveTable';
import { StatusBadge } from './shared/StatusBadge';
import { Field, FormLayout, Feedback } from './shared/FormLayout';
import { PropertyFilter, Pagination } from './shared/Collection';
import { StayTable } from './Stays';
import { errorMessage } from '../Services/client';
function ContactForm({
  tenant,
  vm,
  done,
}: {
  tenant: TenantView | null;
  vm: StaysVM;
  done: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: tenant?.name || '',
      email: tenant?.email || '',
      phone: tenant?.phone || '',
    },
  });
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        const values = { name: v.name, email: v.email || null, phone: v.phone || null };
        if (
          tenant
            ? await vm.update(tenant.id, { ...values, version: tenant.version })
            : await vm.create(values)
        )
          done();
      })}
    >
      <FormLayout>
        <Field label="Tenant name" error={errors.name?.message}>
          <input {...register('name')} />
        </Field>
        <Field label="Contact email" error={errors.email?.message}>
          <input type="email" {...register('email')} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register('phone')} />
        </Field>
      </FormLayout>
      <Feedback error={vm.error} />
      <Button disabled={vm.pending}>Save contact</Button>
    </form>
  );
}
export function Tenants({ session, id }: { session: SessionView; id?: string }) {
  const route = useRoute();
  const { list, detail, actions } = useTenants(parseFilters(route.query), id);
  const [editing, setEditing] = useState<TenantView | null | undefined>();
  const selected = detail.data,
    result = id ? detail : list,
    canWrite = session.user.role !== 'VIEWER';
  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">TENANT DIRECTORY</p>
          <h1>{id ? selected?.name || 'Tenant' : 'Tenants'}</h1>
          <p>Contacts stay connected to their contract and occupancy history.</p>
        </div>
        {id && selected && canWrite ? (
          <Button onClick={() => setEditing(selected)}>Edit contact</Button>
        ) : !id && session.user.role === 'MANAGER' ? (
          <Button asChild>
            <a href={link('/contracts', { new_tenant: 'true' })}>Add tenant with contract</a>
          </Button>
        ) : !id && session.user.role === 'OWNER' ? (
          <Button onClick={() => setEditing(null)}>Add contact</Button>
        ) : null}
      </div>
      <Feedback pending={result.isPending} error={result.error ? errorMessage(result.error) : ''} />
      {id && selected ? (
        <>
          <div className="detail-grid">
            <section className="card">
              <h2>Contact details</h2>
              <dl>
                <dt>Email</dt>
                <dd>{selected.email || '—'}</dd>
                <dt>Phone</dt>
                <dd>{selected.phone || '—'}</dd>
                <dt>Assignments</dt>
                <dd>{selected.contracts.length}</dd>
              </dl>
            </section>
            <section className="card">
              <h2>Contract occupancy</h2>
              <p>Assignment and occupancy follow the contract. End dates are exclusive.</p>
              <Button asChild variant="outline">
                <a
                  href={link('/stays', {
                    tenant_id: selected.id,
                    ...(route.query.business_date
                      ? { business_date: route.query.business_date }
                      : {}),
                  })}
                >
                  Open occupancy history
                </a>
              </Button>
            </section>
          </div>
          <div className="table-card">
            <div className="card-header">
              <h2>Contract history</h2>
            </div>
            <StayTable rows={selected.contracts} context={route.query} />
            {!selected.contracts.length && <div className="empty">No assigned contracts.</div>}
          </div>
          <div className="mt-6">
            <PaymentPanel
              session={session}
              query={{
                tenant_id: selected.id,
                property_id: route.query.property_id,
                business_date: route.query.business_date,
              }}
            />
          </div>
        </>
      ) : (
        !id && (
          <>
            <PropertyFilter session={session} path="/tenants" query={route.query} />
            {session.user.role === 'MANAGER' && (
              <p>New contacts are added together with their first contract.</p>
            )}
            <div className="table-card">
              <ResponsiveTable
                label="Tenants"
                headings={['Tenant', 'Contact', 'Occupancy', 'Assignments', 'Actions']}
              >
                {list.data?.items.map((t) => {
                  const status = t.contracts.some((c) => c.status === 'Current')
                    ? 'Current'
                    : t.contracts.some((c) => c.status === 'Upcoming')
                      ? 'Upcoming'
                      : t.contracts.length
                        ? 'Ended'
                        : 'Unassigned';
                  return (
                    <tr key={t.id}>
                      <td>
                        <a href={link('/tenants/' + encodeURIComponent(t.id), route.query)}>
                          <strong>{t.name}</strong>
                        </a>
                      </td>
                      <td>
                        {t.email || '—'}
                        <small>{t.phone || ''}</small>
                      </td>
                      <td>
                        <StatusBadge status={status} />
                      </td>
                      <td>{t.contracts.length}</td>
                      <td>
                        {canWrite && (
                          <Button variant="outline" onClick={() => setEditing(t)}>
                            Edit {t.name}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </ResponsiveTable>
              {list.data?.total === 0 && (
                <div className="empty">No visible tenants in this scope.</div>
              )}
              <Pagination data={list.data} path="/tenants" query={route.query} />
            </div>
          </>
        )
      )}
      <ResponsiveDialog
        open={editing !== undefined}
        onOpenChange={(v) => {
          if (!v) setEditing(undefined);
        }}
        title={editing ? 'Edit contact' : 'Add contact'}
      >
        {editing !== undefined && (
          <ContactForm
            key={editing?.id || 'new'}
            tenant={editing}
            vm={actions}
            done={() => setEditing(undefined)}
          />
        )}
      </ResponsiveDialog>
    </>
  );
}
