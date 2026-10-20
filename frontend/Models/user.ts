import { z } from 'zod';
export type { UserView, SessionProperty } from '../Generated/types.gen';
export function userFormSchema(isNew: boolean) {
  return z
    .object({
      email: z.email('Enter a valid email'),
      display_name: z.string().trim().min(1, 'Enter a display name').max(100),
      role: z.enum(['OWNER', 'MANAGER', 'VIEWER']),
      enabled: z.boolean(),
      password: z.string(),
    })
    .superRefine((v, ctx) => {
      if (isNew && v.password.length < 12)
        ctx.addIssue({ code: 'custom', path: ['password'], message: 'Use at least 12 characters' });
    });
}
export type UserFormValues = z.infer<ReturnType<typeof userFormSchema>>;
