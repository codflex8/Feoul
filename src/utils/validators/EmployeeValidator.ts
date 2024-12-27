import { z } from "zod";
import { UsersRoles } from "../types/enums";

export const addEmpolyeeValidator = z.object({
  username: z.string().trim().min(3),
  password: z.string().min(6),
  imageUrl: z.string().optional().nullable(),
  role: z.nativeEnum(UsersRoles).default(UsersRoles.Employee),
});
