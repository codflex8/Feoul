import { getUnitById } from "@/lib/actions/map.actions";
import BuildingViewPage from "./BuildingViewPage";
import { notFound } from "next/navigation";

const page = async ({
  params,
}: {
  params: Promise<{ buildingId: string }>;
}) => {
  const unitId = (await params).buildingId;
  const unit = await getUnitById(unitId);

  if (!unit) {
    notFound();
  }

  return <BuildingViewPage unit={unit} />;
};

export default page;
