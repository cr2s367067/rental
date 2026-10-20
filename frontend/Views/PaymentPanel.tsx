import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePayments, type PaymentsVM } from '../VMs/payments.vm';
import { useContracts } from '../VMs/contracts.vm';
import { link } from '../VMs/navigation.vm';
import {
  paymentFormSchema,
  correctionFormSchema,
  obligationFormSchema,
  monthDefaults,
  formatTWD,
  type PaymentFormValues,
  type CorrectionFormValues,
  type ObligationFormValues,
  type ObligationView,
  type PaymentView,
} from '../Models/payment';
import type { SessionView, ContractView, ListAllObligationsData } from '../Generated/types.gen';
import { Button } from './shared/Button';
import { ResponsiveDialog } from './shared/ResponsiveDialog';
import { ResponsiveTable } from './shared/ResponsiveTable';
import { StatusBadge } from './shared/StatusBadge';
import { Field, FormLayout, Feedback } from './shared/FormLayout';
import { Pagination } from './shared/Collection';
import { errorMessage } from '../Services/client';
function PaymentForm({
  period,
  vm,
  done,
}: {
  period: ObligationView;
  vm: PaymentsVM;
  done: () => void;
}) {
  const [key] = useState(() => vm.newIntent());
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: { amount_twd: period.outstanding_twd },
  });
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        if (await vm.record(period.id, v, key)) done();
      })}
    >
      <p>
        {period.tenant_name} · Outstanding {formatTWD(period.outstanding_twd)}
      </p>
      <Field label="Amount TWD" error={errors.amount_twd?.message}>
        <input inputMode="numeric" {...register('amount_twd')} />
      </Field>
      <Feedback error={vm.error} />
      <Button disabled={vm.pending}>Save payment</Button>
    </form>
  );
}
function CorrectionForm({
  payment,
  vm,
  done,
}: {
  payment: PaymentView;
  vm: PaymentsVM;
  done: () => void;
}) {
  const [key] = useState(() => vm.newIntent());
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CorrectionFormValues>({
    resolver: zodResolver(correctionFormSchema),
    defaultValues: { replacement_amount_twd: '' },
  });
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        if (
          await vm.reverse(
            payment.id,
            v.replacement_amount_twd ? { replacement_amount_twd: v.replacement_amount_twd } : {},
            key,
          )
        )
          done();
      })}
    >
      <p>
        Reverse {payment.id}: {formatTWD(payment.amount_twd)}. The original record remains
        unchanged.
      </p>
      <Field label="Replacement amount TWD" error={errors.replacement_amount_twd?.message}>
        <input inputMode="numeric" {...register('replacement_amount_twd')} />
      </Field>
      <p>Leave blank for reversal only. A replacement is a separate payment.</p>
      <Feedback error={vm.error} />
      <Button variant="destructive" disabled={vm.pending}>
        Save correction
      </Button>
    </form>
  );
}
function ObligationForm({
  contracts,
  date,
  selected,
  vm,
  done,
}: {
  contracts: ContractView[];
  date: string;
  selected?: string;
  vm: PaymentsVM;
  done: () => void;
}) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ObligationFormValues>({
    resolver: zodResolver(obligationFormSchema),
    defaultValues: {
      contract_id: selected || '',
      entry_mode: 'FULL_MONTH',
      ...monthDefaults(date),
    },
  });
  const contractId = watch('contract_id'),
    contract = contracts.find((c) => c.id === contractId);
  useEffect(() => {
    if (contract) {
      const values = monthDefaults(date, contract);
      setValue('amount_due_twd', values.amount_due_twd);
      setValue('due_date', values.due_date);
    }
  }, [contract, date, setValue]);
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        const { contract_id, ...body } = v;
        if (await vm.create(contract_id, body)) done();
      })}
    >
      <FormLayout>
        <Field label="Contract" error={errors.contract_id?.message}>
          <select {...register('contract_id')}>
            <option value="">Choose a scoped contract</option>
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenant_name} / {c.resource_name} ({c.id.slice(0, 8)})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Entry mode">
          <select {...register('entry_mode')}>
            <option value="FULL_MONTH">Full calendar month</option>
            <option value="MANUAL_PARTIAL_PERIOD">Explicit partial period</option>
          </select>
        </Field>
        <Field label="Period start" error={errors.period_start?.message}>
          <input type="date" {...register('period_start')} />
        </Field>
        <Field label="Period end" error={errors.period_end?.message}>
          <input type="date" {...register('period_end')} />
        </Field>
        <Field label="Due date" error={errors.due_date?.message}>
          <input type="date" {...register('due_date')} />
        </Field>
        <Field label="Amount due TWD" error={errors.amount_due_twd?.message}>
          <input inputMode="numeric" {...register('amount_due_twd')} />
        </Field>
      </FormLayout>
      <p>
        Partial periods require explicit dates and amounts. No automatic proration or historical
        posting.
      </p>
      <Feedback error={vm.error} />
      <Button disabled={vm.pending}>Save obligation</Button>
    </form>
  );
}
export function PaymentPanel({
  session,
  query = {},
  routeQuery = {},
}: {
  session: SessionView;
  query?: ListAllObligationsData['query'];
  routeQuery?: Record<string, string>;
}) {
  const { list, actions } = usePayments(query),
    contracts = useContracts({ page_size: 100 }).list;
  const [recording, setRecording] = useState<ObligationView>(),
    [historyId, setHistoryId] = useState<string>(),
    [correcting, setCorrecting] = useState<PaymentView>(),
    [creating, setCreating] = useState(false);
  const canWrite = session.user.role !== 'VIEWER',
    history = list.data?.items.find((o) => o.id === historyId);
  const navigationQuery = {
    ...Object.fromEntries(
      Object.entries(query || {})
        .filter((e): e is [string, string | number] => e[1] !== undefined)
        .map(([k, v]) => [k, String(v)]),
    ),
    ...routeQuery,
  };
  return (
    <section className="table-card">
      <div className="card-header">
        <h2>Rental periods</h2>
        {canWrite && <Button onClick={() => setCreating(true)}>Add obligation</Button>}
      </div>
      <div className="px-6">
        <Feedback pending={list.isPending} error={list.error ? errorMessage(list.error) : ''} />
      </div>
      <ResponsiveTable
        label="Rental periods"
        headings={[
          'Tenant / resource',
          'Period / due',
          'Amount due',
          'Net paid',
          'Outstanding',
          'Status',
          'Actions',
        ]}
      >
        {list.data?.items.map((o) => (
          <tr key={o.id}>
            <td>
              <a href={link('/tenants/' + encodeURIComponent(o.tenant_id))}>
                <strong>{o.tenant_name}</strong>
              </a>
              <small>
                {o.property_name} / {o.resource_name}
              </small>
              <a
                className="text-link"
                href={link('/contracts/' + encodeURIComponent(o.contract_id))}
              >
                {o.contract_id.slice(0, 8)}
              </a>
            </td>
            <td>
              {o.period_start} → {o.period_end}
              <small>Due {o.due_date}</small>
              <small>
                {o.entry_mode === 'FULL_MONTH' ? 'Calendar month' : 'Explicit partial period'}
              </small>
            </td>
            <td>{formatTWD(o.amount_due_twd)}</td>
            <td>{formatTWD(o.amount_paid_twd)}</td>
            <td>
              <strong>{formatTWD(o.outstanding_twd)}</strong>
            </td>
            <td>
              <StatusBadge status={o.status} isPartial={o.is_partial} />
            </td>
            <td>
              <div className="actions">
                {canWrite && o.outstanding_twd !== '0' && (
                  <Button variant="outline" onClick={() => setRecording(o)}>
                    Record payment
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setHistoryId(o.id)}>
                  Payment history
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </ResponsiveTable>
      {list.data?.total === 0 && <div className="empty">No rent obligations match this scope.</div>}
      <Pagination data={list.data} path="/payments" query={navigationQuery} />
      <ResponsiveDialog
        open={!!recording}
        onOpenChange={(v) => {
          if (!v) setRecording(undefined);
        }}
        title="Record payment"
      >
        {recording && (
          <PaymentForm
            key={recording.id}
            period={recording}
            vm={actions}
            done={() => setRecording(undefined)}
          />
        )}
      </ResponsiveDialog>
      <ResponsiveDialog
        open={!!history}
        onOpenChange={(v) => {
          if (!v) setHistoryId(undefined);
        }}
        title="Payment history"
        description="Original entries remain visible; corrections append a reversal and optional replacement."
      >
        {history && (
          <>
            <p>
              {history.tenant_name} · {history.period_start} → {history.period_end}
            </p>
            <div className="space-y-4">
              {history.payments.map((p) => (
                <section className="card" key={p.id}>
                  <h3>{p.id}</h3>
                  <p>
                    {p.kind === 'REVERSAL' ? 'Reversal − ' : 'Payment '}
                    {formatTWD(p.amount_twd)}
                  </p>
                  <small>
                    {new Intl.DateTimeFormat('en-GB', {
                      timeZone: 'Asia/Taipei',
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(p.recorded_at))}{' '}
                    · Asia/Taipei
                  </small>
                  {p.reverses_payment_id && <p>Reverses {p.reverses_payment_id}</p>}
                  <a
                    className="block"
                    href={link('/documents', {
                      payment_id: p.id,
                      contract_id: history.contract_id,
                      property_id: history.property_id,
                      tenant_id: history.tenant_id,
                    })}
                  >
                    Receipt files for {p.id}
                  </a>
                  {p.reversal_id ? (
                    <p>Reversed</p>
                  ) : (
                    canWrite &&
                    p.kind === 'PAYMENT' && (
                      <Button
                        variant="outline"
                        aria-label={'Reverse payment ' + p.id}
                        onClick={() => {
                          setHistoryId(undefined);
                          setCorrecting(p);
                        }}
                      >
                        Reverse
                      </Button>
                    )
                  )}
                </section>
              ))}
              {!history.payments.length && <p>No recorded payments.</p>}
            </div>
          </>
        )}
      </ResponsiveDialog>
      <ResponsiveDialog
        open={!!correcting}
        onOpenChange={(v) => {
          if (!v) setCorrecting(undefined);
        }}
        title="Correct payment"
      >
        {correcting && (
          <CorrectionForm
            key={correcting.id}
            payment={correcting}
            vm={actions}
            done={() => setCorrecting(undefined)}
          />
        )}
      </ResponsiveDialog>
      <ResponsiveDialog open={creating} onOpenChange={setCreating} title="Add obligation">
        {creating && (
          <ObligationForm
            contracts={contracts.data?.items || []}
            date={session.business_date}
            selected={query?.contract_id}
            vm={actions}
            done={() => setCreating(false)}
          />
        )}
      </ResponsiveDialog>
    </section>
  );
}
