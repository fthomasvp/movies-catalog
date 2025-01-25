import { asc, desc, eq, like } from "drizzle-orm";

import { db } from "../db";
import { type Movie, movie, type MovieShowId, type NewMovie } from "../schemas";
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  getCount,
  type PaginationParams,
} from "../utils";

type MovieSearchParams = PaginationParams & {
  field: keyof Movie;
  value: string;
};

export class MovieService {
  async findAll(params: PaginationParams) {
    const {
      offset = DEFAULT_PAGINATION_OFFSET,
      limit = DEFAULT_PAGINATION_LIMIT,
      sort = "asc",
    } = params;

    const totalItems = await getCount({ table: movie });
    const items = await db
      .select({
        showId: movie.showId,
        type: movie.type,
        title: movie.title,
        duration: movie.duration,
        description: movie.description,
        releaseYear: movie.releaseYear,
      })
      .from(movie)
      .offset(offset)
      .limit(limit)
      .orderBy(
        sort && sort === "desc"
          ? desc(movie.releaseYear)
          : asc(movie.releaseYear),
      );

    return {
      items,
      offset,
      limit,
      total: totalItems.value,
    };
  }

  async findById(showId: MovieShowId) {
    return await db.select().from(movie).where(eq(movie.showId, showId));
  }

  async search(params: MovieSearchParams) {
    const {
      field,
      value,
      offset = DEFAULT_PAGINATION_OFFSET,
      limit = DEFAULT_PAGINATION_LIMIT,
    } = params;
    const condition = like(movie[field], `%${value}%`);

    const totalItems = await getCount({
      table: movie,
      condition,
    });
    const items = await db
      .select({
        showId: movie.showId,
        type: movie.type,
        title: movie.title,
        duration: movie.duration,
        description: movie.description,
        releaseYear: movie.releaseYear,
      })
      .from(movie)
      .where(condition)
      .offset(offset)
      .limit(limit);

    return {
      items,
      offset,
      limit,
      total: totalItems.value,
    };
  }

  async add(params: NewMovie) {
    return await db
      .insert(movie)
      .values(params)
      .returning({ showId: movie.showId });
  }

  async update(params: NewMovie) {
    const { showId, ...restMovie } = params;

    return await db
      .update(movie)
      .set(restMovie)
      .where(eq(movie.showId, showId!))
      .returning({ showId: movie.showId });
  }

  async remove(showId: MovieShowId) {
    return await db
      .delete(movie)
      .where(eq(movie.showId, showId))
      .returning({ showId: movie.showId });
  }
}
