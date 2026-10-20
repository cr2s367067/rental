import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDocuments, useContracts, type ContractsVM } from '../VMs/contracts.vm';
import { useTenants } from '../VMs/stays.vm';
import { useRoute, link } from '../VMs/navigation.vm';
import { parseFilters } from '../Models/filter';
import { documentFormSchema, type DocumentFormValues, type DocumentView } from '../Models/document';
import type { SessionView, ContractView, TenantView } from '../Generated/types.gen';
import { Button } from './shared/Button';
import { ResponsiveDialog } from './shared/ResponsiveDialog';
import { ResponsiveTable } from './shared/ResponsiveTable';
import { Field, FormLayout, Feedback } from './shared/FormLayout';
import { PropertyFilter, Pagination } from './shared/Collection';
import { errorMessage } from '../Services/client';
function UploadForm({
  session,
  contracts,
  tenants,
  query,
  vm,
  done,
}: {
  session: SessionView;
  contracts: ContractView[];
  tenants: TenantView[];
  query: Record<string, string>;
  vm: ContractsVM;
  done: () => void;
}) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      kind: query.payment_id ? 'RECEIPT' : query.contract_id ? 'CONTRACT' : 'PROPERTY',
      property_id: query.property_id || session.properties[0]?.id || '',
      contract_id: query.contract_id || '',
      tenant_id: query.tenant_id || '',
      payment_id: query.payment_id || '',
    },
  });
  const contractId = watch('contract_id'),
    kind = watch('kind'),
    contract = contracts.find((c) => c.id === contractId);
  useEffect(() => {
    if (contract) {
      setValue('property_id', contract.property_id);
      setValue('tenant_id', contract.tenant_id);
    }
  }, [contract, setValue]);
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        if (
          await vm.upload({
            kind: v.kind,
            property_id: v.property_id,
            contract_id: v.contract_id || undefined,
            tenant_id: v.tenant_id || undefined,
            payment_id: v.payment_id || undefined,
            file: v.file[0],
          })
        )
          done();
      })}
    >
      <FormLayout>
        <Field label="Document kind">
          <select {...register('kind')}>
            <option value="PROPERTY">Property file</option>
            <option value="CONTRACT">Contract</option>
            <option value="TENANT">Tenant document</option>
            <option value="RECEIPT">Receipt</option>
          </select>
        </Field>
        <Field label="Property" error={errors.property_id?.message}>
          <select {...register('property_id')}>
            {session.properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Related contract" error={errors.contract_id?.message}>
          <select {...register('contract_id')}>
            <option value="">No contract</option>
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenant_name} / {c.resource_name} ({c.id.slice(0, 8)})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Related tenant" error={errors.tenant_id?.message}>
          <select {...register('tenant_id')}>
            <option value="">No tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>
        {kind === 'RECEIPT' && (
          <Field label="Payment reference" error={errors.payment_id?.message}>
            <input {...register('payment_id')} />
          </Field>
        )}
        <Field label="File" error={errors.file?.message}>
          <input
            type="file"
            accept="application/pdf,image/png,image/jpeg,text/plain"
            {...register('file')}
          />
        </Field>
      </FormLayout>
      <p>PDF, PNG, JPEG or UTF-8 text · Maximum 10 MiB. Original contents stay protected.</p>
      <Feedback error={vm.error} />
      <Button disabled={vm.pending}>Save document</Button>
    </form>
  );
}
export function Documents({ session }: { session: SessionView }) {
  const route = useRoute();
  const { list, actions } = useDocuments({
    ...parseFilters(route.query),
    payment_id: route.query.payment_id || undefined,
  });
  const contracts = useContracts({ page_size: 100 }).list,
    tenants = useTenants({ page_size: 100 }).list;
  const [uploading, setUploading] = useState(false);
  const canWrite = session.user.role !== 'VIEWER';
  async function download(doc: DocumentView) {
    const blob = await actions.download(doc.id);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = doc.file_name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">PROTECTED FILE LIBRARY</p>
          <h1>Documents</h1>
          <p>
            Metadata is visible within your property scope. Contents require Owner or Manager
            access.
          </p>
        </div>
        {canWrite && <Button onClick={() => setUploading(true)}>Upload file</Button>}
      </div>
      <PropertyFilter session={session} path="/documents" query={route.query} />
      <Feedback pending={list.isPending} error={list.error ? errorMessage(list.error) : ''} />
      {!uploading && <Feedback error={actions.error} />}
      <div className="table-card">
        <ResponsiveTable
          label="Documents"
          headings={['File', 'Kind', 'Associations', 'Size / uploaded', 'Actions']}
        >
          {list.data?.items.map((d) => (
            <tr key={d.id}>
              <td>
                <strong>{d.file_name}</strong>
                <small>{d.mime_type}</small>
              </td>
              <td>{d.kind}</td>
              <td>
                {session.properties.find((p) => p.id === d.property_id)?.name}
                {d.payment_id && <small>Payment {d.payment_id}</small>}
                {d.contract_id && (
                  <small>
                    <a href={link('/contracts/' + encodeURIComponent(d.contract_id))}>
                      {d.contract_id.slice(0, 12)}
                    </a>
                  </small>
                )}
                {d.tenant_id && (
                  <small>
                    <a href={link('/tenants/' + encodeURIComponent(d.tenant_id))}>Tenant record</a>
                  </small>
                )}
              </td>
              <td>
                {d.size_bytes.toLocaleString()} bytes
                <small>
                  {new Intl.DateTimeFormat('en-CA', {
                    timeZone: 'Asia/Taipei',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }).format(new Date(d.uploaded_at))}{' '}
                  · Taiwan
                </small>
              </td>
              <td>
                {canWrite ? (
                  <Button variant="outline" disabled={actions.pending} onClick={() => download(d)}>
                    Download
                  </Button>
                ) : (
                  <small>Metadata only</small>
                )}
              </td>
            </tr>
          ))}
        </ResponsiveTable>
        {list.data?.total === 0 && <div className="empty">No documents match these filters.</div>}
        <Pagination data={list.data} path="/documents" query={route.query} />
      </div>
      <ResponsiveDialog open={uploading} onOpenChange={setUploading} title="Upload document">
        {uploading && (
          <UploadForm
            session={session}
            contracts={contracts.data?.items || []}
            tenants={tenants.data?.items || []}
            query={route.query}
            vm={actions}
            done={() => setUploading(false)}
          />
        )}
      </ResponsiveDialog>
    </>
  );
}
