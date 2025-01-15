import { z } from "zod";

export const MapLocationValidator = z.object({
  name: z.string(),
  type: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export enum MapLocationClassification {
  primary = "primary",
  secondary = "secondary",
}

export type MapLocationType = z.infer<typeof MapLocationValidator>;
