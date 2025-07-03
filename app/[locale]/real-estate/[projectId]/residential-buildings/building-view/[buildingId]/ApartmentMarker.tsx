"use client";
import { useState } from "react";
import { Polygon, useMap, useMapEvent } from "react-leaflet";
import { useTranslations } from "next-intl";
import ApartmentPopup from "./ApartmentPopup";

const ApartmentMarker = ({ apartment }: { apartment: any }) => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());
  const t = useTranslations("BuildingViewPage");

  useMapEvent("zoomend", () => {
    setZoomLevel(map.getZoom());
  });

  // تحويل polygon من البيانات المحفوظة
  const getPolygonPositions = () => {
    if (apartment.polygon && Array.isArray(apartment.polygon)) {
      return apartment.polygon.map(point => [Number(point[0]), Number(point[1])]);
    }
    
    // fallback للبيانات القديمة التي تستخدم lat/lng
    if (apartment.lat && apartment.lng) {
      const centerLat = Number(apartment.lat);
      const centerLng = Number(apartment.lng);
      const buildSpace = apartment.buildSpace || 80;
      
      // إنشاء مستطيل حول النقطة المركزية بناءً على المساحة
      const halfWidth = Math.sqrt(buildSpace) * 0.3;
      const halfHeight = Math.sqrt(buildSpace) * 0.2;
      
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "#10B981"; // أخضر
      case "reserved":
        return "#F59E0B"; // برتقالي
      case "saled":
        return "#EF4444"; // أحمر
      default:
        return "#6B7280"; // رمادي
    }
  };

  const statusColor = getStatusColor(apartment.status);

  return (
    <Polygon
      positions={polygonPositions}
      pathOptions={{
        color: statusColor,
        fillColor: statusColor,
        fillOpacity: 0.5,
        weight: 2,
        opacity: 0.9,
      }}
      eventHandlers={{
        mouseover: (e) => {
          e.target.setStyle({
            fillOpacity: 0.7,
            weight: 3,
          });
        },
        mouseout: (e) => {
          e.target.setStyle({
            fillOpacity: 0.5,
            weight: 2,
          });
        },
      }}
    >
      <ApartmentPopup apartment={apartment} />
    </Polygon>
  );
};

export default ApartmentMarker;