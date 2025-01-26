import { count, type SQL } from "drizzle-orm";
import type { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";

import { db } from "../db";

type GetCount = {
  // biome-ignore lint/suspicious/noExplicitAny: Too much effort for typing
  table: PgTableWithColumns<any>;
  condition?: SQL<unknown>;
};

/**
 * Get the amount of items from a table.
 *
 * @param table - a table schema.
 * @param condition - a SQL statement that will be used inside the `where` function.
 * @returns an object with the `value` property representing the amount as a number.
 */
export const getCount = async (params: GetCount) => {
  const { table, condition = undefined } = params;

  const [totalItems] = await db
    .select({ value: count() })
    .from(table)
    .where(condition);

  return totalItems;
};
