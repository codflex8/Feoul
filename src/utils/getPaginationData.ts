import { BaseQuery } from "./types/types";

export const getPaginationData = <T extends BaseQuery>({
  page,
  pageSize,
}: T) => {
  const take = pageSize ?? 10;
  const skip = ((page ?? 1) - 1) * take;
  return { skip, take };
};
