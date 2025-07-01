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

  // حساب الأبعاد بناءً على المساحة ونوع العمارة
  const calculateDimensions = () => {
    const baseSize = building.size || 100; // المساحة الأساسية
    const zoomFactor = zoomLevel / 2;
    
    // تحديد نسبة العرض إلى الارتفاع حسب نوع العمارة
    let aspectRatio = 1; // مربع افتراضي
    
    if (building.buildingType?.name) {
      const typeName = building.buildingType.name.toLowerCase();
      if (typeName.includes('طويل') || typeName.includes('مستطيل')) {
        aspectRatio = 0.6; // مستطيل طولي
      } else if (typeName.includes('عريض')) {
        aspectRatio = 1.8; // مستطيل عريض
      } else if (typeName.includes('مربع')) {
        aspectRatio = 1; // مربع
      }
    }
    
    // حساب الأبعاد بناءً على المساحة
    const area = Math.sqrt(baseSize); // الجذر التربيعي للمساحة
    const width = area * Math.sqrt(aspectRatio) * zoomFactor * 0.8;
    const height = area / Math.sqrt(aspectRatio) * zoomFactor * 0.8;
    
    return {
      width: Math.max(width, 30), // حد أدنى للعرض
      height: Math.max(height, 30) // حد أدنى للارتفاع
    };
  };

  const dimensions = calculateDimensions();

  // إنشاء شكل مخصص للعمارة
  const createBuildingShape = () => {
    const { width, height } = dimensions;
    
    return `
      <div style="
        width: ${width}px;
        height: ${height}px;
        background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
        border: 2px solid #2C5282;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${Math.min(width, height) * 0.15}px;
        font-weight: bold;
        opacity: 0.9;
        transition: all 0.3s ease;
      ">
        <!-- إضافة تفاصيل العمارة -->
        <div style="
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          height: 20%;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        "></div>
        <div style="
          position: absolute;
          bottom: 2px;
          left: 2px;
          right: 2px;
          height: 15%;
          background: rgba(0,0,0,0.1);
          border-radius: 2px;
        "></div>
        <!-- رقم العمارة -->
        <span>${building.number}</span>
        
        <!-- مؤشر نوع العمارة -->
        <div style="
          position: absolute;
          top: -8px;
          right: -8px;
          width: 16px;
          height: 16px;
          background: #10B981;
          border-radius: 50%;
          border: 2px solid white;
          font-size: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          🏢
        </div>
      </div>
    `;
  };

  const icon = L.divIcon({
    className: "custom-building-icon",
    html: createBuildingShape(),
    iconSize: [dimensions.width, dimensions.height],
    iconAnchor: [dimensions.width / 2, dimensions.height / 2],
  });

  return (
    <Marker
      position={[Number(building.position[0]), Number(building.position[1])]}
      icon={icon}
      title={`بناية رقم : ${building.number} - نوع : ${building.buildingType?.name || ""} - المساحة: ${building.size}م²`}
    >
      <ResidentialBuildingPopup building={building} />
    </Marker>
  );
};

export default ResidentialBuildingMarker;