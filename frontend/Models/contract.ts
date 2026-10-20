import { z } from 'zod';
export type { ContractView } from '../Generated/types.gen';
const money = z.string().regex(/^(0|[1-9]\d{0,11})$/, 'Enter exact whole TWD (up to 12 digits)');
export const contractFormSchema = z
  .object({
    tenant_mode: z.enum(['existing', 'new']),
    tenant_id: z.string(),
    new_name: z.string(),
    new_email: z.string(),
    new_phone: z.string(),
    resource_id: z.string().min(1, 'Select a resource'),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a start date'),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose an end date'),
    monthly_rent_twd: money,
    deposit_twd: money,
    due_day: z.number().int().min(1).max(28),
    primary_document_id: z.string(),
  })
  .superRefine((v, c) => {
    if (v.start_date >= v.end_date)
      c.addIssue({
        code: 'custom',
        path: ['end_date'],
        message: 'End must be after start (exclusive)',
      });
    if (v.tenant_mode === 'existing' && !v.tenant_id)
      c.addIssue({ code: 'custom', path: ['tenant_id'], message: 'Select a tenant' });
    if (v.tenant_mode === 'new') {
      if (!v.new_name.trim())
        c.addIssue({ code: 'custom', path: ['new_name'], message: 'Enter a tenant name' });
      if (v.new_email && !z.email().safeParse(v.new_email).success)
        c.addIssue({ code: 'custom', path: ['new_email'], message: 'Enter a valid email' });
    }
  });
export type ContractFormValues = z.infer<typeof contractFormSchema>;
