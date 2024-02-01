import { SQL, count } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { db } from '../db';

type GetCount = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: PgTableWithColumns<any>;
  condition?: SQL<unknown>;
};

/**
 * Use this to get the amount of items from a table.
 *
 * @param condition - an SQL statement that will be used inside the `where` function.
 * @returns an object with the `value` property representing the amount as a number.
 */
export const getCount = async ({ table, condition = undefined }: GetCount) => {
  const [totalItems] = await db
    .select({ value: count() })
    .from(table)
    .where(condition);

  return totalItems;
};
