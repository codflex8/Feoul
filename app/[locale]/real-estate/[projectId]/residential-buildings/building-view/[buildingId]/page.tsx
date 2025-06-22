import { getResidentialBuildingById } from "@/lib/actions/map.actions";
import ResidentialBuildingViewPage from "./ResidentialBuildingViewPage";
import { notFound } from "next/navigation";

const page = async ({
  params,
}: {
  params: Promise<{ buildingId: string }>;
}) => {
  const buildingId = (await params).buildingId;
  const building = await getResidentialBuildingById(buildingId);

  if (!building) {
    notFound();
  }

  return <ResidentialBuildingViewPage building={building} />;
};

export default page;