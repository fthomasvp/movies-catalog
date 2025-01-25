import { z } from "zod";

export const UserValidator = z.object({
  firstName: z.string().min(2).max(45),
  lastName: z.string().min(2).max(45),
  email: z.string().email(),
  password: z.string().min(8),
  isActive: z.boolean().default(false),
});
