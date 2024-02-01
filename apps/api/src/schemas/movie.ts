import { index, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const movie = pgTable(
  'movie',
  {
    showId: text('show_id').$defaultFn(() => createId()),
    type: text('type'),
    title: text('title'),
    director: text('director'),
    cast: text('cast'),
    country: text('country'),
    dateAdded: text('date_added'),
    releaseYear: text('release_year'),
    rating: text('rating'),
    duration: text('duration'),
    listedIn: text('listed_in'),
    description: text('description'),
  },
  movie => ({
    titleIndex: uniqueIndex('title_idx').on(movie.title),
    directorIndex: index('director_idx').on(movie.director),
    castIndex: index('cast_idx').on(movie.cast),
    countryIndex: index('country_idx').on(movie.country),
  }),
);

export type Movie = typeof movie.$inferSelect; // return type when queried
export type NewMovie = typeof movie.$inferInsert; // insert type
