import { z } from "zod";
import { CommonStatus } from "../types/enums";

const ProjectTemplateValidator = z.object({
  name: z.string().min(1, "Name is required"),
  number: z.number(),
  // projectId: z.string(),
  link: z.string().url().optional(),
  status: z.nativeEnum(CommonStatus).default(CommonStatus.archived),
});

export type ProjectTemplateType = z.infer<typeof ProjectTemplateValidator>;

export default ProjectTemplateValidator;
