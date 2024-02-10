import { z } from 'zod';

import { DEFAULT_PAGINATION_LIMIT } from '../utils';

export const PaginationValidator = z.object({
  offset: z
    .string()
    .transform(val => parseInt(val))
    .pipe(z.number().min(0).default(0)),
  limit: z
    .string()
    .transform(val => parseInt(val))
    .pipe(
      z
        .number()
        .min(DEFAULT_PAGINATION_LIMIT)
        .max(300)
        .default(DEFAULT_PAGINATION_LIMIT),
    ),
  sort: z.string().optional().default('asc'),
});
