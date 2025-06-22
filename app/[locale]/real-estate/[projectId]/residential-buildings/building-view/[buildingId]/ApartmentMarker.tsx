"use client";
import { useState } from "react";
import L from "leaflet";
import { Marker, useMap, useMapEvent } from "react-leaflet";
import { useTranslations } from "next-intl";
import ApartmentPopup from "./ApartmentPopup";

const ApartmentMarker = ({ apartment }: { apartment: any }) => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());
  const t = useTranslations("BuildingViewPage");

  useMapEvent("zoomend", () => {
    setZoomLevel(map.getZoom());
  });

  const iconSize = [
    40 * (zoomLevel / 2),
    40 * (zoomLevel / 2),
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "#4CAF50";
      case "reserved":
        return "#FF9800";
      case "saled":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const icon = L.divIcon({
    className: "custom-icon",
    html: `<div style="
      background: ${getStatusColor(apartment.status)};
      opacity: 0.8;
      width: ${iconSize[0]}px;
      height: ${iconSize[1]}px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      border-radius: 4px;
      border: 1px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    ">
      ${apartment.number}
    </div>`,
  });

  return (
    <Marker
      position={[Number(apartment.position[0]), Number(apartment.position[1])]}
      icon={icon}
      title={`${apartment.name} - ${t(`${apartment.status}`)}`}
    >
      <ApartmentPopup apartment={apartment} />
    </Marker>
  );
};

export default ApartmentMarker;