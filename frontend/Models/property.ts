import { z } from 'zod';
export type { PropertyView, ResourceView } from '../Generated/types.gen';
export const propertyFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter a property name').max(150),
  city: z.string().trim().min(1, 'Enter a city'),
  address: z.string().trim().min(1, 'Enter an address'),
  owner_user_id: z.string().min(1, 'Select an Owner'),
  rental_mode: z.enum(['ROOMS', 'WHOLE_PROPERTY']),
});
export const resourceFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter a resource name'),
  capacity: z.number().int('Enter a whole capacity').min(1, 'Capacity must be positive').max(1000),
  kind: z.enum(['ROOM', 'WHOLE_PROPERTY']),
});
export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
export type ResourceFormValues = z.infer<typeof resourceFormSchema>;
