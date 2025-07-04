"use client";
import { useState } from "react";
import { Polygon, useMap, useMapEvent } from "react-leaflet";
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

   const getPolygonPositions = () => {
    if (building.polygon && Array.isArray(building.polygon)) {
      return building.polygon.map(point => [Number(point[0]), Number(point[1])]);
    }
    
     if (building.position && Array.isArray(building.position)) {
      const centerLat = Number(building.position[0]);
      const centerLng = Number(building.position[1]);
      const size = building.size || 100;
      
       const halfWidth = Math.sqrt(size) * 0.5;
      const halfHeight = Math.sqrt(size) * 0.3;
      
      return [
        [centerLat - halfHeight, centerLng - halfWidth],
        [centerLat - halfHeight, centerLng + halfWidth],
        [centerLat + halfHeight, centerLng + halfWidth],
        [centerLat + halfHeight, centerLng - halfWidth],
      ];
    }
    
    return [];
  };

  const polygonPositions = getPolygonPositions();

  if (polygonPositions.length === 0) {
    return null;
  }

  const getStatusColor = () => {
  const typeName = building.buildingType?.name?.toUpperCase() ?? "";
  if (typeName === "A") return "#FDD492"; 
  if (typeName === "BA") return "#A5ADEC";  
  if (typeName === "BB") return "#C97F72";  
  if (typeName === "C") return "#EAB3E1";  
  if (typeName === "D") return "#BCC96D";  

  return "#4A90E2"; 
};

  return (
    <Polygon
      positions={polygonPositions}
      pathOptions={{
        color: getStatusColor(),
        fillColor: getStatusColor(),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 0.8,
      }}
      eventHandlers={{
        mouseover: (e) => {
          e.target.setStyle({
            fillOpacity: 0.6,
            weight: 3,
          });
        },
        mouseout: (e) => {
          e.target.setStyle({
            fillOpacity: 0.4,
            weight: 2,
          });
        },
      }}
    >
      <ResidentialBuildingPopup building={building} />
    </Polygon>
  );
};

export default ResidentialBuildingMarker;