import L from "leaflet";
import { Project } from "@/types/map.types";
import React, { useEffect } from "react";
import { useTranslations } from 'next-intl';
import { useMap } from "react-leaflet";


const AlwaysOpenPopup = ({ position, children, project }: { position: [number, number]; children: React.ReactNode, project: Project }) => {
  const map = useMap();
  const t = useTranslations("MapPage")
  const language = t("language").toLowerCase() == "en" ? "ar" : "en";

  // تحديد المسار بناءً على نوع المشروع
  const getProjectPath = () => {
    if (project.type === "عمارات سكنية") {
      return `${language}/real-estate/${project.id}/residential-buildings`;
    } else {
      return `${language}/real-estate/${project.id}`;
    }
  };

  useEffect(() => {
    const popup = L.popup({ autoClose: false, closeOnClick: false, closeButton: false, className: "projects-popup" })
      .setLatLng(position)
      .setContent(`<a href=${getProjectPath()} style="font-size:14px; display:flex;flex-direction:column;gap:5px; max-width:70px; align-items:center; justify-content:center;">
                       <span style="font-size:14px">   <img src="/assets/icons/sarah-logo.png" style="width:60px;height:40px" /></span>
                       <span style="font-size:10px">${project.name}</span>
                       <span style="font-size:8px; color: #666;">${project.type}</span>
                  </a>`)
      .openOn(map);

    return () => {
      map.closePopup(popup);
    };
  }, [map, position, children, project]);

  return null;
};

export default AlwaysOpenPopup;