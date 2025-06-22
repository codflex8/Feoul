import { useRouter, usePathname } from "next/navigation";
import { Popup } from "react-leaflet";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { ResidentialBuilding } from "@/types/map.types";

type Props = {
  building: ResidentialBuilding;
};

const ResidentialBuildingPopup = ({ building }: Props) => {
  const pathname = usePathname();
  const { push } = useRouter();
  const t = useTranslations("BuildingViewPage");

  return (
    <Popup className="min-w-64">
      <div className="text-sm">
        <h6 className="text-base font-bold flex items-center justify-between">
          <span>{building.name}</span>
          <span className="text-xs text-gray-500">{t(`${building.status}`)}</span>
        </h6>
        <p className="flex items-center justify-between !my-0 mb-2">
          نوع العمارة: {building.buildingType?.name || "غير محدد"}
        </p>
        <p className="flex items-center justify-between !my-0">
          <span>المشروع:</span>
          <span>{building.project.name}</span>
        </p>
      </div>
      <Button
        className="w-full mt-1"
        onClick={() => push(`${pathname}/building-view/${building.id}`)}
      >
        عرض العمارة السكنية
      </Button>
    </Popup>
  );
};

export default ResidentialBuildingPopup;