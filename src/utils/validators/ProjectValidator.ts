import { z } from "zod";
import { CommonStatus } from "../types/enums";

export const ProjectValidator = z.object({
  name: z.string(),
  lat: z.string().transform((val) => Number(val)),
  lng: z.string().transform((val) => Number(val)),
  number: z.string().transform((val) => Number(val)),
  status: z.nativeEnum(CommonStatus).default(CommonStatus.archived),
  projectDocUrl: z.string().url().optional(),
  city: z.string().optional(),
  templateId: z.string().optional(),
});

export const projectFacilitesValidator = z.object({
  name: z.string(),
  projectId: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export type ProjectFacilitesType = z.infer<typeof projectFacilitesValidator>;
export type ProjectType = z.infer<typeof ProjectValidator>;
