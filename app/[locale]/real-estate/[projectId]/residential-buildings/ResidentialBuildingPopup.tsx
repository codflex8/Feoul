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
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (building.buildingType?.buildingImage) {
      setImageUrl(`http://13.59.197.112${building.buildingType.buildingImage}`);
    }
  }, [building.buildingType?.buildingType]);

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
         <span> نوع العمارة: {building.buildingType?.name || "غير محدد"}</span>
         <span> المساحة: {building.size} م</span>
        </p>
        <p className="flex items-center justify-between mb-2">
          <span>المشروع:</span>
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
  عرض العمارة السكنية
</Button>

    </Popup>
  );
};

export default ResidentialBuildingPopup;
