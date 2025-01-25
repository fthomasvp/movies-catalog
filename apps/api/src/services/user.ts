import { asc, desc, eq } from "drizzle-orm";

import { db } from "../db";
import { type NewUser, User, user, type UserId } from "../schemas";
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  getCount,
  type PaginationParams,
} from "../utils";

type UserFindByParams = {
  field: keyof Pick<User, "email" | "id">;
  value: string;
};

export class UserService {
  async findAll(params: PaginationParams) {
    const {
      offset = DEFAULT_PAGINATION_OFFSET,
      limit = DEFAULT_PAGINATION_LIMIT,
      sort = "asc",
    } = params;

    const totalItems = await getCount({ table: user });
    const items = await db
      .select({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .offset(offset)
      .limit(limit)
      .orderBy(
        sort && sort === "desc" ? desc(user.createdAt) : asc(user.createdAt),
      );

    return {
      items,
      offset,
      limit,
      total: totalItems.value,
    };
  }

  async findBy(params: UserFindByParams) {
    const { field, value } = params;

    return await db.select().from(user).where(eq(user[field], value));
  }

  async add(params: NewUser) {
    return await db.insert(user).values(params).returning({ id: user.id });
  }

  async update(params: NewUser) {
    const { id, ...restUser } = params;

    return await db
      .update(user)
      .set(restUser)
      .where(eq(user.id, id!))
      .returning({ id: user.id });
  }

  async remove(id: UserId) {
    return await db
      .delete(user)
      .where(eq(user.id, id))
      .returning({ id: user.id });
  }
}
