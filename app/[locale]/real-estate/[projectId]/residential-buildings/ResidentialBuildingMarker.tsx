"use client";
import { useState } from "react";
import L from "leaflet";
import { Marker, useMap, useMapEvent } from "react-leaflet";
import { ResidentialBuilding } from "@/types/map.types";
import ResidentialBuildingPopup from "./ResidentialBuildingPopup";
import { useTranslations } from "next-intl";

const ResidentialBuildingMarker = ({ building }: { building: ResidentialBuilding }) => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());
  const t = useTranslations("BuildingViewPage");

  useMapEvent("zoomend", () => {
    setZoomLevel(map.getZoom());
  });

  const iconSize = [
    100 * (zoomLevel / 2),
    100 * (zoomLevel / 2),
  ];

  const icon = L.divIcon({
    className: "custom-icon",
    html: `<div style="
      background: #4A90E2;
      opacity: 0.8;
      width: ${iconSize[0]}px;
      height: ${iconSize[1]}px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      border-radius: 8px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    ">
      ${building.number}
    </div>`,
  });

  return (
    <Marker
      position={[Number(building.position[0]), Number(building.position[1])]}
      icon={icon}
      title={`بناية رقم : ${building.number} - نوع : ${building.buildingType?.name || ""} `}
    >
      <ResidentialBuildingPopup building={building} />
    </Marker>
  );
};

export default ResidentialBuildingMarker;