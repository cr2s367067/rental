import { z } from 'zod';
import type { ListAllObligationsData, ContractView } from '../Generated/types.gen';
import { parseFilters } from './filter';
export type { ObligationView, PaymentView } from '../Generated/types.gen';
export { formatTWD } from './money';
const whole = z.string().regex(/^(0|[1-9]\d{0,11})$/, 'Enter exact whole TWD');
export const paymentFormSchema = z.object({
  amount_twd: z.string().regex(/^[1-9]\d{0,11}$/, 'Enter a positive whole TWD amount'),
});
export const correctionFormSchema = z.object({
  replacement_amount_twd: z.union([
    z.literal(''),
    z.string().regex(/^[1-9]\d{0,11}$/, 'Enter a positive whole TWD amount'),
  ]),
});
export const obligationFormSchema = z
  .object({
    contract_id: z.string().min(1, 'Choose a contract'),
    period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose period start'),
    period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose exclusive period end'),
    due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose due date'),
    amount_due_twd: whole,
    entry_mode: z.enum(['FULL_MONTH', 'MANUAL_PARTIAL_PERIOD']),
  })
  .refine((v) => v.period_start < v.period_end, {
    path: ['period_end'],
    message: 'End must be after start',
  });
export type ObligationFormValues = z.infer<typeof obligationFormSchema>;
export function parsePaymentFilters(
  input: Record<string, string>,
): NonNullable<ListAllObligationsData['query']> {
  const status = ['Paid', 'Overdue', 'Partial Payment', 'Unpaid'].includes(input.status)
    ? (input.status as NonNullable<ListAllObligationsData['query']>['status'])
    : undefined;
  return { ...parseFilters(input), status };
}
export function monthDefaults(date: string, contract?: ContractView) {
  const first = date.slice(0, 7) + '-01',
    end = new Date(first + 'T00:00:00Z');
  end.setUTCMonth(end.getUTCMonth() + 1);
  return {
    period_start: first,
    period_end: end.toISOString().slice(0, 10),
    due_date: date.slice(0, 7) + '-' + String(contract?.due_day || 1).padStart(2, '0'),
    amount_due_twd: contract?.monthly_rent_twd || '',
  };
}
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
export type CorrectionFormValues = z.infer<typeof correctionFormSchema>;
