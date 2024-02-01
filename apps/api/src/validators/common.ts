import { z } from 'zod';

export const PaginationValidator = z.object({
  offset: z
    .string()
    .transform(val => parseInt(val))
    .pipe(z.number().min(0).default(0)),
  limit: z
    .string()
    .transform(val => parseInt(val))
    .pipe(z.number().min(10).default(10)),
  sort: z.string().optional().default('asc'),
});
