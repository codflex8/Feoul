import { z } from "zod";
import { CommonStatus } from "../types/enums";

export enum UnitCategoriesNames {
  yasmeen = "الياسمين",
  toleeb = "توليب",
  orkeed = "اوركيد",
}

export const CategoriesImages = {
  yasmeen: [
    "/public/categories/yasmeen/yasmeen-1.jpeg",
    "/public/categories/yasmeen/yasmeen-2.jpeg",
    "/public/categories/yasmeen/yasmeen-3.jpeg",
    "/public/categories/yasmeen/yasmeen-4.jpeg",
  ],
  orkeed: [
    "/public/categories/orkeed/orkeed-1.jpeg",
    "/public/categories/orkeed/orkeed-2.jpeg",
    "/public/categories/orkeed/orkeed-3.jpeg",
    "/public/categories/orkeed/orkeed-4.jpeg",
  ],
  toleeb: [
    "/public/categories/toleeb/toleeb-1.jpeg",
    "/public/categories/toleeb/toleeb-2.jpeg",
    "/public/categories/toleeb/toleeb-3.jpeg",
  ],
};

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
  number: z.number(),
  // color: z.string(),
  price: z.number(),
  landSpace: z.number(),
  buildSpace: z.number(),
  status: z.nativeEnum(UnitStatus).default(UnitStatus.avaliable),
  bedroomNumber: z.number(),
  bathroomNumber: z.number(),
  videoUrl: z.string().optional(),
  // floorsNumber: z.nullable().number(),
  advantages: z.string().optional(),
  categoryId: z.string(),
  type: z.nativeEnum(UnitTypes),
  buildStatus: z.nativeEnum(UnitBuildStatus),
  buildLevel: z.number(),
  salesChannels: z.array(z.string()).optional().default([]),
  saledSpace: z.number(),
  position_x: z.number(),
  position_y: z.number(),
});

export const SetUnitStatusValidator = z.object({
  status: z.nativeEnum(UnitStatus),
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

export const unitCategoryFloorUpdate = z.object({
  name: z.string(),
  index: z
    .string()
    .nonempty()
    .transform((val) => Number(val)),
  image: z.string(),
  categoryId: z.string(),
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
  // price: z.number(),
});

export type UnitReverseType = z.infer<typeof reverseUnitValidator>;
export type UnitIntresetType = z.infer<typeof unitIntresetValidation>;
export type UnitFloorType = z.infer<typeof unitFloorValidation>;
export type unitCategoryFloorUpdateType = z.infer<
  typeof unitCategoryFloorUpdate
>;
export type UnitCategoryType = z.infer<typeof unitCategoryValidation>;
export type UnitType = z.infer<typeof UnitValidator>;
export type SetUnitStatusType = z.infer<typeof SetUnitStatusValidator>;
export default UnitValidator;
