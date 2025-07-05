import { useRouter, usePathname } from "next/navigation";
import { Popup } from "react-leaflet";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { ResidentialBuilding } from "@/types/map.types";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Props = {
  building: ResidentialBuilding;
};

const ResidentialBuildingPopup = ({ building }: Props) => {
  const pathname = usePathname();
  const { push } = useRouter();
  const t = useTranslations("BuildingViewPage");
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (building.buildingType?.buildingImage) {
      setImageUrl(`http://13.59.197.112${building.buildingType.buildingImage}`);
    }
  }, [building.buildingType?.buildingImage]);

  return (
    <Popup className="min-w-64">
      <div className="text-sm">
        <h6 className="text-base mb-4 font-bold flex items-center justify-between">
          <span className="w-full h-20 relative">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Building Type Image"
                fill
                className="object-cover"
              />
            )}
          </span>
        </h6>

        <p className="flex items-center justify-between  mb-2">
         <span> {t("BuildingType")}: {building.buildingType?.name || t("NotSpecified")}</span>
         <span> {t("Area")}: {building.size} {t("Meter")}</span>
        </p>
        <p className="flex items-center justify-between mb-2">
          <span>{t("Project")}:</span>
          <span>{building.project.name}</span>
        </p>
      </div>
<Button
  className="w-full mt-1"
  onClick={() =>
    push(
      `${pathname}/building-view/${building.id}?projectName=${encodeURIComponent(
        building.project.name
      )}&image=${encodeURIComponent(imageUrl)}&projectId=${encodeURIComponent(building.project.id)}`
    )
  }
>
  {t("ViewResidentialBuilding")}
</Button>

    </Popup>
  );
};

export default ResidentialBuildingPopup;