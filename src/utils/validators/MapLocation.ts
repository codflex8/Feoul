import { z } from "zod";

export const MapLocationValidator = z.object({
  name: z.string(),
  type: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export type MapLocationType = z.infer<typeof MapLocationValidator>;
