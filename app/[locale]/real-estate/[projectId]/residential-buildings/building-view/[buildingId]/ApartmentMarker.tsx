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

  // حساب أبعاد الشقة بناءً على المساحة وعدد الغرف
  const calculateApartmentDimensions = () => {
    const buildSpace = apartment.buildSpace || 80; // مساحة البناء
    const bedrooms = apartment.bedroomNumber || 2;
    const bathrooms = apartment.bathroomNumber || 1;
    
    const zoomFactor = zoomLevel / 2;
    
    // حساب نسبة العرض إلى الارتفاع بناءً على عدد الغرف
    let aspectRatio = 1;
    if (bedrooms >= 4) {
      aspectRatio = 1.4; // شقة كبيرة - مستطيلة
    } else if (bedrooms === 3) {
      aspectRatio = 1.2; // شقة متوسطة
    } else if (bedrooms <= 2) {
      aspectRatio = 0.9; // شقة صغيرة - مربعة تقريباً
    }
    
    // حساب الأبعاد
    const baseSize = Math.sqrt(buildSpace) * 2; // ضرب في 2 لجعل الحجم مناسب للعرض
    const width = baseSize * Math.sqrt(aspectRatio) * zoomFactor * 0.6;
    const height = baseSize / Math.sqrt(aspectRatio) * zoomFactor * 0.6;
    
    return {
      width: Math.max(width, 25),
      height: Math.max(height, 20)
    };
  };

  const dimensions = calculateApartmentDimensions();

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

  const createApartmentShape = () => {
    const { width, height } = dimensions;
    const statusColor = getStatusColor(apartment.status);
    
    return `
      <div style="
        width: ${width}px;
        height: ${height}px;
        background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}CC 100%);
        border: 1.5px solid white;
        border-radius: 3px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${Math.min(width, height) * 0.2}px;
        font-weight: bold;
        opacity: 0.9;
        transition: all 0.3s ease;
        cursor: pointer;
      ">
        <!-- تقسيم الشقة إلى غرف (تمثيل بصري) -->
        <div style="
          position: absolute;
          top: 1px;
          left: 1px;
          right: 1px;
          bottom: 1px;
          display: grid;
          grid-template-columns: repeat(${Math.min(apartment.bedroomNumber, 3)}, 1fr);
          grid-template-rows: repeat(${apartment.bedroomNumber > 3 ? 2 : 1}, 1fr);
          gap: 1px;
        ">
          ${Array.from({length: Math.min(apartment.bedroomNumber + apartment.bathroomNumber, 6)}, (_, i) => `
            <div style="
              background: rgba(255,255,255,0.1);
              border-radius: 1px;
            "></div>
          `).join('')}
        </div>
        
        <!-- رقم الشقة -->
        <span style="
          position: relative;
          z-index: 2;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        ">${apartment.number}</span>
        
        <!-- مؤشر المساحة -->
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          color: white;
          font-size: 8px;
          padding: 1px 3px;
          border-radius: 2px;
          white-space: nowrap;
        ">
          ${apartment.buildSpace}م²
        </div>
      </div>
    `;
  };

  const icon = L.divIcon({
    className: "custom-apartment-icon",
    html: createApartmentShape(),
    iconSize: [dimensions.width, dimensions.height],
    iconAnchor: [dimensions.width / 2, dimensions.height / 2],
  });

  return (
    <Marker
      position={[Number(apartment.lat), Number(apartment.lng)]}
      icon={icon}
      title={`${apartment.name} - ${apartment.bedroomNumber} غرف - ${apartment.buildSpace}م² - ${t(`${apartment.status}`)}`}
    >
      <ApartmentPopup apartment={apartment} />
    </Marker>
  );
};

export default ApartmentMarker;