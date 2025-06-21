"use client";
import { useState } from "react";
import L from "leaflet";
import { Marker, useMap, useMapEvent } from "react-leaflet";
import { Unit } from "@/types/map.types";
import UnitPopup from "./UnitPopup";
import { useTranslations } from "next-intl";

const DynamicMarker = ({ unit }: { unit: Unit }) => {
   const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());
  const t = useTranslations("BuildingViewPage");

  useMapEvent("zoomend", () => {
    setZoomLevel(map.getZoom());
  });

  const iconSize = [
    Number(unit.size[0]) * (zoomLevel / 2),
    Number(unit.size[1]) * (zoomLevel / 2),
  ];
  const getRotationAngle = (unitNumber: number): number => {
    if (unitNumber >= 1 && unitNumber <= 5) return 0;
    if (unitNumber >= 6 && unitNumber <= 7) return -3.5;
    if (unitNumber >= 8 && unitNumber <= 11) return -7.5;
    if (unitNumber >= 12 && unitNumber <= 13) return -8.1;
    if (unitNumber >= 14 && unitNumber <= 20) return -15.6;
    if (unitNumber >= 21 && unitNumber <= 27) return -22.9;
    if (unitNumber >= 28 && unitNumber <= 33) return -31.9;
    if (unitNumber >= 34 && unitNumber <= 37) return -22.5;
    if (unitNumber >= 38 && unitNumber <= 48) return -9.5;

    if (unitNumber >= 49 && unitNumber <= 55) return -11;
    if (unitNumber >= 56 && unitNumber <= 60) return -19.5;
    if (unitNumber >= 61 && unitNumber <= 67) return -33;

    if (unitNumber >= 68 && unitNumber <= 73) return -31.9; 
    if (unitNumber >= 74 && unitNumber <= 77) return -22.5; 
    if (unitNumber >= 78 && unitNumber <= 87) return -1.5;  
    if (unitNumber >= 88 && unitNumber <= 94) return -32;   
    if (unitNumber >= 95 && unitNumber <= 97) return -19.5; 

    if (unitNumber >= 98 && unitNumber <= 135) return 14.2;
    if (unitNumber >= 136 && unitNumber <= 143) return 7.2;
    if (unitNumber >= 144 && unitNumber <= 151) return -2.8;

    return 0;
};


  
  const rotationAngle = getRotationAngle(Number(unit.number));

  const icon = L.divIcon({
    className: "custom-icon",
    html: `<div style="
      background: ${unit.category?.color || "#fff"};
      opacity: 0.2;
      width: ${iconSize[0]}px;
      height: ${iconSize[1]}px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      transition: all 0.3s ease transform;
      transform: rotate(${rotationAngle}deg);
    ">
    </div>`,
  });
  return (
    <Marker
      position={[Number(unit.position[0]), Number(unit.position[1])]}
      icon={icon}
      title={`${unit.name} - ${unit.category?.name || ""} - ${t(`${unit.status}`)}`}
    >
      <UnitPopup unit={unit} />
    </Marker>
  );
};

export default DynamicMarker;
