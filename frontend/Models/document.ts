import { z } from 'zod';
export type { DocumentView } from '../Generated/types.gen';
const fileSchema = z
  .custom<FileList>(
    (files) =>
      typeof files === 'object' && files !== null && 'length' in files && files.length === 1,
    'Choose one file',
  )
  .refine((files) => !files?.[0] || files[0].size <= 10485760, 'Files must be at most 10 MiB')
  .refine(
    (files) =>
      !files?.[0] ||
      ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'].includes(files[0].type),
    'Choose PDF, PNG, JPEG or UTF-8 text',
  );
export const documentFormSchema = z
  .object({
    kind: z.enum(['CONTRACT', 'TENANT', 'RECEIPT', 'PROPERTY']),
    property_id: z.string().min(1, 'Choose a property'),
    contract_id: z.string(),
    tenant_id: z.string(),
    payment_id: z.string(),
    file: fileSchema,
  })
  .superRefine((v, c) => {
    if (v.kind === 'CONTRACT' && !v.contract_id)
      c.addIssue({ code: 'custom', path: ['contract_id'], message: 'Choose a contract' });
    if (v.kind === 'RECEIPT' && !v.payment_id)
      c.addIssue({ code: 'custom', path: ['payment_id'], message: 'Enter a payment reference' });
    if (v.kind === 'TENANT' && !v.tenant_id && !v.contract_id)
      c.addIssue({ code: 'custom', path: ['tenant_id'], message: 'Choose a tenant or contract' });
  });
export type DocumentFormValues = z.infer<typeof documentFormSchema>;
