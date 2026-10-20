import { z } from 'zod';
export type { TenantView, StayView } from '../Generated/types.gen';
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter a tenant name').max(150),
  email: z.union([z.email('Enter a valid email'), z.literal('')]),
  phone: z.string().max(50),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;
