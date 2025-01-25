import { z } from "zod";

import { DEFAULT_PAGINATION_LIMIT } from "../utils";

export const PaginationValidator = z.object({
  offset: z
    .string()
    .transform((val) => Number.parseInt(val))
    .pipe(z.number().min(0).default(0)),
  limit: z
    .string()
    .transform((val) => Number.parseInt(val))
    .pipe(
      z
        .number()
        .min(DEFAULT_PAGINATION_LIMIT)
        .max(300)
        .default(DEFAULT_PAGINATION_LIMIT),
    ),
  sort: z.string().optional().default("asc"),
});

export const validateCUID2 = (id: string) => {
  const cuid2 = z.string().cuid2();

  return cuid2.parse(id);
};
