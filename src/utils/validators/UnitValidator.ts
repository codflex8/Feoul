import { z } from "zod";
import { CommonStatus } from "../types/enums";

export enum UnitStatus {
  saled = "saled",
  reserved = "reserved",
  avaliable = "avaliable",
}

export enum UnitTypes {
  villa = "villa",
  townhouse = "townhouse",
}

export enum UnitIntresetStatus {
  buy = "buy",
  reserve = "reserve",
  intreset = "intreset",
}

export enum UnitTemplates {
  yasmin = "الياسمين",
  lavender = "لافندر",
  orcid = "اوركيد",
  tolib = "توليب",
}

export enum UnitBuildStatus {
  noConstruction = "no_construction",
  construction = "construction",
}

const UnitValidator = z.object({
  // name: z.string(),
  projectId: z.string(),
  number: z
    .string()
    .nonempty()
    .transform((val) => Number(val)),
  // color: z.string(),
  price: z
    .string()
    .nonempty()
    .transform((val) => Number(val)),
  landSpace: z
    .string()
    .nonempty()
    .transform((val) => Number(val)),
  buildSpace: z
    .string()
    .nonempty()
    .transform((val) => Number(val)),
  status: z.nativeEnum(UnitStatus).default(UnitStatus.avaliable),
  bedroomNumber: z
    .string()
    .nonempty()
    .transform((val) => Number(val)),
  bathroomNumber: z
    .string()
    .nonempty()
    .transform((val) => Number(val)),
  videoUrl: z.string().optional(),
  floorsNumber: z
    .string()
    .nonempty()
    .transform((val) => Number(val)),
  advantages: z.string().optional(),
  categoryId: z.string(),
  type: z.nativeEnum(UnitTypes),
  buildStatus: z.nativeEnum(UnitBuildStatus),
  buildLevel: z
    .string()
    .nonempty()
    .transform((val) => Number(val)),
  salesChannels: z.array(z.string()).optional(),
  saledSpace: z
    .string()
    .nonempty()
    .transform((val) => Number(val)),
});

export const unitCategoryValidation = z.object({
  name: z.string(),
  color: z.string(),
  // number: z.number(),
  status: z.nativeEnum(CommonStatus).default(CommonStatus.archived),
  // unitId: z.string(),
});

export const unitFloorValidation = z.object({
  name: z.string(),
  index: z
    .string()
    .nonempty()
    .transform((val) => Number(val)),
  unitId: z.string(),
  image: z.string(),
});

export const unitIntresetValidation = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  area: z.string(),
  email: z.string().optional(),
  notes: z.string().optional(),
  unitId: z.string(),
});

export const reverseUnitValidator = z.object({
  intresetId: z.string(),
  price: z.number(),
});

export type UnitReverseType = z.infer<typeof reverseUnitValidator>;
export type UnitIntresetType = z.infer<typeof unitIntresetValidation>;
export type UnitFloorType = z.infer<typeof unitFloorValidation>;
export type UnitCategoryType = z.infer<typeof unitCategoryValidation>;
export type UnitType = z.infer<typeof UnitValidator>;

export default UnitValidator;
