import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContracts, useDocuments, type ContractsVM } from '../VMs/contracts.vm';
import { useResources } from '../VMs/properties.vm';
import { useTenants } from '../VMs/stays.vm';
import { useRoute, link } from '../VMs/navigation.vm';
import { parseFilters } from '../Models/filter';
import { contractFormSchema, type ContractFormValues, type ContractView } from '../Models/contract';
import { formatTWD } from '../Models/money';
import type { SessionView, ResourceView, TenantView, DocumentView } from '../Generated/types.gen';
import { Button } from './shared/Button';
import { ResponsiveDialog } from './shared/ResponsiveDialog';
import { ResponsiveTable } from './shared/ResponsiveTable';
import { StatusBadge } from './shared/StatusBadge';
import { Field, FormLayout, Feedback } from './shared/FormLayout';
import { PropertyFilter, Pagination } from './shared/Collection';
import { errorMessage } from '../Services/client';
function ContractForm({
  contract,
  session,
  resources,
  tenants,
  documents,
  newContact,
  vm,
  done,
}: {
  contract: ContractView | null;
  session: SessionView;
  resources: ResourceView[];
  tenants: TenantView[];
  documents: DocumentView[];
  newContact: boolean;
  vm: ContractsVM;
  done: () => void;
}) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      tenant_mode: newContact ? 'new' : 'existing',
      tenant_id: contract?.tenant_id || '',
      new_name: '',
      new_email: '',
      new_phone: '',
      resource_id: contract?.resource_id || '',
      start_date: contract?.start_date || session.business_date,
      end_date: contract?.end_date || '',
      monthly_rent_twd: contract?.monthly_rent_twd || '',
      deposit_twd: contract?.deposit_twd || '0',
      due_day: contract?.due_day || 1,
      primary_document_id: contract?.primary_document_id || '',
    },
  });
  const mode = watch('tenant_mode');
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        const terms = {
          resource_id: v.resource_id,
          start_date: v.start_date,
          end_date: v.end_date,
          monthly_rent_twd: v.monthly_rent_twd,
          deposit_twd: v.deposit_twd,
          due_day: v.due_day,
        };
        const saved = contract
          ? await vm.update(contract.id, {
              ...terms,
              tenant_id: v.tenant_id,
              primary_document_id: v.primary_document_id || null,
              version: contract.version,
            })
          : await vm.create({
              ...terms,
              ...(v.tenant_mode === 'new'
                ? {
                    new_tenant: {
                      name: v.new_name,
                      email: v.new_email || null,
                      phone: v.new_phone || null,
                    },
                  }
                : { tenant_id: v.tenant_id }),
            });
        if (saved) done();
      })}
    >
      <FormLayout>
        {!contract && (
          <Field label="Tenant selection">
            <select {...register('tenant_mode')}>
              <option value="existing">Existing tenant</option>
              <option value="new">New contact with first contract</option>
            </select>
          </Field>
        )}
        {mode === 'new' && !contract ? (
          <>
            <Field label="New tenant name" error={errors.new_name?.message}>
              <input {...register('new_name')} />
            </Field>
            <Field label="New tenant email" error={errors.new_email?.message}>
              <input type="email" {...register('new_email')} />
            </Field>
            <Field label="New tenant phone">
              <input {...register('new_phone')} />
            </Field>
          </>
        ) : (
          <Field label="Tenant" error={errors.tenant_id?.message}>
            <select {...register('tenant_id')}>
              <option value="">Choose a visible tenant</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Resource" error={errors.resource_id?.message}>
          <select {...register('resource_id')}>
            <option value="">Choose a scoped resource</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.property_name} / {r.name} · {r.current_count}/{r.capacity} now
              </option>
            ))}
          </select>
        </Field>
        <Field label="Start date" error={errors.start_date?.message}>
          <input type="date" {...register('start_date')} />
        </Field>
        <Field label="End date" error={errors.end_date?.message}>
          <input type="date" {...register('end_date')} />
        </Field>
        <Field label="Monthly rent TWD" error={errors.monthly_rent_twd?.message}>
          <input inputMode="numeric" {...register('monthly_rent_twd')} />
        </Field>
        <Field label="Deposit TWD" error={errors.deposit_twd?.message}>
          <input inputMode="numeric" {...register('deposit_twd')} />
        </Field>
        <Field label="Due day" error={errors.due_day?.message}>
          <input type="number" min="1" max="28" {...register('due_day', { valueAsNumber: true })} />
        </Field>
        {contract && (
          <Field label="Primary contract document">
            <select {...register('primary_document_id')}>
              <option value="">No primary document</option>
              {documents
                .filter((d) => d.kind === 'CONTRACT')
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.file_name}
                  </option>
                ))}
            </select>
          </Field>
        )}
      </FormLayout>
      <p>
        Start inclusive, end exclusive · Asia/Taipei. Saving a contract does not create rent
        obligations.
      </p>
      <Feedback error={vm.error} />
      <Button disabled={vm.pending}>Save contract</Button>
    </form>
  );
}
function TerminationForm({
  contract,
  date,
  vm,
  done,
}: {
  contract: ContractView;
  date: string;
  vm: ContractsVM;
  done: () => void;
}) {
  const { register, handleSubmit } = useForm<{ termination_date: string }>({
    defaultValues: { termination_date: date },
  });
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        if (await vm.terminate(contract.id, { ...v, version: contract.version })) done();
      })}
    >
      <Field label="Termination date">
        <input
          type="date"
          max={contract.end_date}
          {...register('termination_date', { required: true })}
        />
      </Field>
      <p>The contract stops occupying its resource on this date. History remains visible.</p>
      <Feedback error={vm.error} />
      <Button variant="destructive" disabled={vm.pending}>
        Save termination
      </Button>
    </form>
  );
}
export function Contracts({ session, id }: { session: SessionView; id?: string }) {
  const route = useRoute();
  const { list, detail, actions } = useContracts(parseFilters(route.query), id);
  const resources = useResources({ page_size: 100 }).list,
    tenants = useTenants({ page_size: 100 }).list;
  const selected = detail.data;
  const documents = useDocuments({ contract_id: id, page_size: 100 }).list;

  const [editing, setEditing] = useState<ContractView | null | undefined>(
      route.query.new_tenant === 'true' ? null : undefined,
    ),
    [terminating, setTerminating] = useState<ContractView>();
  const canWrite = session.user.role !== 'VIEWER';
  const result = id ? detail : list;
  function close() {
    setEditing(undefined);
    if (route.query.new_tenant) {
      const query = { ...route.query };
      delete query.new_tenant;
      window.location.hash = link('/contracts', query).slice(1);
    }
  }
  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">AGREEMENTS & ASSIGNMENTS</p>
          <h1>{id ? 'Contract details' : 'Contracts'}</h1>
          <p>
            {id
              ? selected?.tenant_name
              : 'Contracts are the source of occupancy, capacity and agreement history.'}
          </p>
        </div>
        <div className="actions">
          {id && selected && canWrite && (
            <>
              <Button onClick={() => setEditing(selected)}>Edit contract</Button>
              <Button variant="outline" onClick={() => setTerminating(selected)}>
                Terminate contract
              </Button>
            </>
          )}
          {!id && canWrite && <Button onClick={() => setEditing(null)}>Add contract</Button>}
        </div>
      </div>
      <Feedback pending={result.isPending} error={result.error ? errorMessage(result.error) : ''} />
      {id && selected ? (
        <>
          <div className="detail-grid">
            <section className="card">
              <div className="card-header">
                <h2>{selected.id}</h2>
                <StatusBadge status={selected.status} />
              </div>
              <dl>
                <dt>Tenant</dt>
                <dd>
                  <a href={link('/tenants/' + encodeURIComponent(selected.tenant_id))}>
                    {selected.tenant_name}
                  </a>
                </dd>
                <dt>Resource</dt>
                <dd>{selected.resource_name}</dd>
                <dt>Property</dt>
                <dd>
                  <a href={link('/properties/' + encodeURIComponent(selected.property_id))}>
                    {selected.property_name}
                  </a>
                </dd>
                <dt>Start inclusive</dt>
                <dd>{selected.start_date}</dd>
                <dt>End exclusive</dt>
                <dd>{selected.end_date}</dd>
                <dt>Effective end</dt>
                <dd>{selected.effective_end_date}</dd>
                {selected.termination_date && (
                  <>
                    <dt>Termination</dt>
                    <dd>{selected.termination_date}</dd>
                  </>
                )}
              </dl>
            </section>
            <section className="card">
              <h2>Agreement amounts</h2>
              <dl>
                <dt>Monthly rent</dt>
                <dd>{formatTWD(selected.monthly_rent_twd)}</dd>
                <dt>Deposit</dt>
                <dd>{formatTWD(selected.deposit_twd)}</dd>
                <dt>Due day</dt>
                <dd>{selected.due_day}</dd>
                <dt>Primary document</dt>
                <dd>
                  {documents.data?.items.find((d) => d.id === selected.primary_document_id)
                    ?.file_name || 'None'}
                </dd>
              </dl>
              <Button asChild variant="outline">
                <a
                  href={link('/documents', {
                    contract_id: selected.id,
                    property_id: selected.property_id,
                  })}
                >
                  Upload documents
                </a>
              </Button>
            </section>
          </div>
          <div className="card">
            <h2>Related records</h2>
            <a
              href={link('/payments', {
                contract_id: selected.id,
                property_id: selected.property_id,
                business_date: route.query.business_date,
              })}
            >
              Rent obligations & payments
            </a>
            <div className="actions">
              <Button asChild variant="ghost">
                <a
                  href={link('/stays', {
                    contract_id: selected.id,
                    business_date: route.query.business_date,
                  })}
                >
                  Occupancy history
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href={link('/tenants/' + encodeURIComponent(selected.tenant_id))}>
                  Tenant details
                </a>
              </Button>
            </div>
          </div>
        </>
      ) : (
        !id && (
          <>
            <PropertyFilter session={session} path="/contracts" query={route.query} />
            <div className="table-card">
              <ResponsiveTable
                label="Contracts"
                headings={[
                  'Contract / tenant',
                  'Property / resource',
                  'Term',
                  'Monthly rent',
                  'Status',
                  'Actions',
                ]}
              >
                {list.data?.items.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <a
                        aria-label={'Open contract for ' + c.tenant_name}
                        href={link('/contracts/' + encodeURIComponent(c.id), route.query)}
                      >
                        <strong>{c.id.length > 16 ? c.id.slice(0, 8) : c.id}</strong>
                      </a>
                      <a href={link('/tenants/' + encodeURIComponent(c.tenant_id))}>
                        {c.tenant_name}
                      </a>
                    </td>
                    <td>
                      {c.property_name}
                      <small>{c.resource_name}</small>
                    </td>
                    <td>
                      {c.start_date} → {c.effective_end_date}
                      <small>End exclusive</small>
                    </td>
                    <td>{formatTWD(c.monthly_rent_twd)}</td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td>
                      {canWrite && (
                        <Button variant="outline" onClick={() => setEditing(c)}>
                          Edit {c.tenant_name}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </ResponsiveTable>
              {list.data?.total === 0 && (
                <div className="empty">No contracts match these filters.</div>
              )}
              <Pagination data={list.data} path="/contracts" query={route.query} />
            </div>
          </>
        )
      )}
      <ResponsiveDialog
        open={editing !== undefined}
        onOpenChange={(v) => {
          if (!v) close();
        }}
        title={editing ? 'Edit contract' : 'Add contract'}
      >
        {editing !== undefined && (
          <ContractForm
            key={editing?.id || 'new'}
            contract={editing}
            session={session}
            resources={resources.data?.items || []}
            tenants={tenants.data?.items || []}
            documents={
              documents.data?.items.filter((d) => d.contract_id === (editing?.id || id)) || []
            }
            newContact={route.query.new_tenant === 'true'}
            vm={actions}
            done={close}
          />
        )}
      </ResponsiveDialog>
      <ResponsiveDialog
        open={!!terminating}
        onOpenChange={(v) => {
          if (!v) setTerminating(undefined);
        }}
        title="Terminate contract"
      >
        {terminating && (
          <TerminationForm
            contract={terminating}
            date={session.business_date}
            vm={actions}
            done={() => setTerminating(undefined)}
          />
        )}
      </ResponsiveDialog>
    </>
  );
}
