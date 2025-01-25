import { z } from "zod";

import { PaginationValidator } from "./common";

export const MovieSearchValidator = PaginationValidator.extend({
  field: z.enum(["title", "director", "cast", "country"]),
  value: z.string().min(3),
});

export const MovieValidator = z.object({
  type: z.enum(["Movie", "TV Show"]),
  title: z.string(),
  director: z.string(),
  cast: z.string(),
  country: z.string(),
  dateAdded: z.string(),
  releaseYear: z.string(),
  rating: z.enum([
    "TV-Y",
    "TV-Y7-FV",
    "TV-G",
    "TV-14",
    "TV-MA",
    "TV-Y7",
    "G",
    "NC-17",
    "PG",
    "TV-PG",
    "PG-13",
    "R",
    "UR",
    "NR",
  ]),
  duration: z.string(),
  listedIn: z.string(),
  description: z.string(),
});
