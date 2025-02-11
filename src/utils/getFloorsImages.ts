import { UnitCategoriesNames } from "./validators/UnitValidator";

export function getFloorsImages(category: string) {
  if (category === UnitCategoriesNames.yasmeen) {
    return [
      {
        index: 0,
        name: "الطابق الارضي",
        imageUrl: "/public/floors/yasmeen/1.jpeg",
      },
      {
        index: 1,
        name: "الطابق الاول",
        imageUrl: "/public/floors/yasmeen/2.jpeg",
      },
      {
        index: 2,
        name: "الطابق الثاني",
        imageUrl: "/public/floors/yasmeen/3.jpeg",
      },
    ];
  }
  if (category === UnitCategoriesNames.orkeed) {
    return [
      {
        index: 0,
        name: "الطابق الارضي",
        imageUrl: "/public/floors/orkeeda/1.jpeg",
      },
      {
        index: 1,
        name: "الطابق الاول",
        imageUrl: "/public/floors/orkeeda/2.jpeg",
      },
      {
        index: 2,
        name: "الطابق الثاني",
        imageUrl: "/public/floors/orkeeda/3.jpeg",
      },
    ];
  }
  if (category === UnitCategoriesNames.toleeb) {
    return [
      {
        index: 0,
        name: "الطابق الارضي",
        imageUrl: "/public/floors/toleeb/1.jpeg",
      },
      {
        index: 1,
        name: "الطابق الاول",
        imageUrl: "/public/floors/toleeb/2.jpeg",
      },
      {
        index: 2,
        name: "الطابق الثاني",
        imageUrl: "/public/floors/toleeb/3.jpeg",
      },
    ];
  }
  return [];
}
