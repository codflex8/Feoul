"use client";
import { useState } from "react";
import { Tooltip,Polygon, useMap, useMapEvent } from "react-leaflet";
import { useTranslations } from "next-intl";
import ApartmentPopup from "./ApartmentPopup";

const ApartmentMarker = ({ apartment }: { apartment: any }) => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());
  const t = useTranslations("BuildingViewPage");

  useMapEvent("zoomend", () => {
    setZoomLevel(map.getZoom());
  });

 const getPolygonPositions = () => {

  if (apartment.polygon && Array.isArray(apartment.polygon)) {
    const converted = apartment.polygon.map(point => [Number(point[0]), Number(point[1])]);
     return converted;
  }

  if (apartment.lat && apartment.lng) {
    const centerLat = Number(apartment.lat);
    const centerLng = Number(apartment.lng);
    const buildSpace = apartment.buildSpace || 80;

    const halfWidth = Math.sqrt(buildSpace) * 0.3;
    const halfHeight = Math.sqrt(buildSpace) * 0.2;

    const fallback = [
      [centerLat - halfHeight, centerLng - halfWidth],
      [centerLat - halfHeight, centerLng + halfWidth],
      [centerLat + halfHeight, centerLng + halfWidth],
      [centerLat + halfHeight, centerLng - halfWidth],
    ];

    console.log("🟡 Fallback rectangle:", fallback);
    return fallback;
  }

  console.warn("❌ No polygon or lat/lng found.");
  return [];
};


  const polygonPositions = getPolygonPositions();

  if (polygonPositions.length === 0) {
    return null;
  }

 const getStatusColor = (status: string) => {
  const normalized = status.toLowerCase().trim();

  switch (normalized) {
    case "available":
    case "avaliable":  
      return "#10B981"; 
    case "reserved":
      return "#F59E0B"; 
    case "saled":
      return "#EF4444"; 
    default:
      return "#6B7280"; 
  }
};


  const statusColor = getStatusColor(apartment.status);

  return (
    <Polygon
      positions={polygonPositions}
      pathOptions={{
        color: statusColor,
        fillColor: statusColor,
        fillOpacity: 0.1,
        // weight: 2,
        opacity: 0.2,
      }}
      eventHandlers={{
        mouseover: (e) => {
          e.target.setStyle({
            fillOpacity: 0.05,
            // weight: 3,
          });
        },
        mouseout: (e) => {
          e.target.setStyle({
            fillOpacity: 0.1,
            // weight: 2,
          });
        },
      }}
    >

       <Tooltip direction="top" sticky >
            <div>
              <div>شقة رقم: {apartment.number}- نموذج :{apartment.type?.name ?? "-"}</div>
            </div>
          </Tooltip>
      <ApartmentPopup apartment={apartment} />
    </Polygon>
  );
};

export default ApartmentMarker;