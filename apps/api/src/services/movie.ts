import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  type PaginationParams,
  getCount,
} from '../utils';
import { Movie, NewMovie, movie } from '../schemas';
import { asc, desc, eq, like } from 'drizzle-orm';
import { db } from '../db';

type SearchParams = PaginationParams & { field: keyof Movie; value: string };
type RemoveParams = { showId: NonNullable<Movie['showId']> };

export class MovieService {
  async findAll(params: PaginationParams) {
    const {
      offset = DEFAULT_PAGINATION_OFFSET,
      limit = DEFAULT_PAGINATION_LIMIT,
      sort = 'asc',
    } = params;

    const totalItems = await getCount({ table: movie });
    const items = await db
      .select()
      .from(movie)
      .offset(offset)
      .limit(limit)
      .orderBy(sort && sort === 'desc' ? desc(movie.title) : asc(movie.title));

    return {
      items,
      offset,
      limit,
      total: totalItems.value,
    };
  }

  async search(params: SearchParams) {
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
      .select()
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
      .where(eq(movie.showId, showId!));
  }

  async remove(params: RemoveParams) {
    const { showId } = params;

    return await db.delete(movie).where(eq(movie.showId, showId));
  }
}
