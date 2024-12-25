import { z } from "zod";

export enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
}

export enum LanguageEnum {
  english = "en",
  arabic = "ar",
}

export const signInValidator = z.object({
  username: z.string(),
  password: z.string().min(6),
});
