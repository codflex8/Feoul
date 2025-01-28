import { z } from "zod";

export const issueValidator = z.object({
  name: z.string().min(3).max(255),
  phoneNumber: z.string(),
  description: z.string(),
});

export type Issue = z.infer<typeof issueValidator>;
