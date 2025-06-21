"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import L from "leaflet";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { LatLng, MapProps } from "@/types/map.types";
import "@fortawesome/fontawesome-free/css/all.min.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
import clsx from "clsx";

import { useTranslations } from "next-intl";
import DropdownPlacesOptionsMenu from "./DropdownPlacesOptions";
import WebsiteTitleSec from "./WebsiteTitleSec";
import ControlFunctions from "./ControlFunctions";
import AlwaysOpenPopup from "./AlwaysOpenPopup";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import NeedHelpForm from "./form/NeedHelpForm";

const getCustomSVG = (name: string) => `
  <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 60C20 60 30 48 37.5 33.5C45 19 39.5 7 28 2C17.5 -3 7 2 3 9C-1 17 -1 20 3 30C7 40 20 60 20 60Z" fill="#2F3F5D80" fill-opacity="0.6"/>
    <text x="50%" y="40%" fill="white" font-size="6" text-anchor="middle">
      <tspan x="50%" dy="0">${name.split(" ")[0]}</tspan>
      <tspan x="50%" dy="8">${name.split(" ")[1] || ""}</tspan>
    </text>
  </svg>
`;

const getCustomIcon1 = (name: string, type: string) => {
  return L.divIcon({
    className: "custom-icon",
    html: `
      <div style="
        opacity:60%;
        color:white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        ${name}</div>
      `,
    iconSize: [50, 65],
    iconAnchor: [25, 65],
    popupAnchor: [0, -65],
  });  
};
const encodeSVG = (svg: string) =>
  `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

const getCustomIcon = (name: string, type: string) => {
  return L.divIcon({
    className: "custom-icon",
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <!-- شكل العلامة -->
        <div style="
          width: 40px;
          height: 40px;
          background: #2F3F5D80;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
        ">
          <i class="fas ${
            type === "hospital"
              ? "fa-hospital"
              : type === "airport"
              ? "fa-plane"
              : type === "mosque"
              ? "fa-mosque"
              : type === "educate"
              ? "fa-university"
              : type === "sport"
              ? "fa-futbol"
              : "fa-map-marker"
          } fa-lg" style="color: white;"></i>
        </div>
        
        <!-- ذيل المؤشر -->
        <div style="
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 15px solid rgba(47, 63, 93, 0.5);
          margin-top: -2px;
        "></div>
  
        <!-- اسم المعلم -->
        <div style="
          background: rgba(0, 0, 0, 0.3);
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 3px 6px;
          border-radius: 4px;
          margin-top: 5px;
          max-width: 60px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        ">${name}</div>
      </div>`,
    iconSize: [50, 65],
    iconAnchor: [25, 65],
    popupAnchor: [0, -65],
  });
  
};

const Map = ({ projects, basicLandmarks, landmarks }: MapProps) => {
  const t = useTranslations("MapPage");
  const allTypes = Array.from(
    new Set(basicLandmarks.map((landmark) => landmark.type))
  );

  const [selectedTypes, setSelectedTypes] = useState<string[]>(allTypes);
  const [openHelpForm, setOpenHelpForm] = useState<boolean>(false);

  const filteredLandmarks = basicLandmarks.filter((landmark) =>
    selectedTypes.length ? selectedTypes.includes(landmark.type) : []
  );
  const filteredLandmarks1 = landmarks.filter((landmark) =>
    selectedTypes.length ? selectedTypes.includes(landmark.type) : []
  );
  const bounds = L.latLngBounds([21.55, 39.01], [21.8, 39.45]);

  const fillPolygonOptions = {
    color: "green",
    weight: 2,
    opacity: 0.8,
    fillColor: "green",
    fillOpacity: 0.3,
  };

  useEffect(() => {
    const updateZoomControlPosition = () => {
      const map = document.querySelector(".leaflet-container");
      const zoomControl = map?.querySelector(
        ".leaflet-top.leaflet-left"
      ) as HTMLElement;

      if (zoomControl) {
        if (t("language").toLowerCase() === "en") {
          zoomControl.style.right = "auto";
        } else {
          zoomControl.style.right = "10px";
          zoomControl.style.left = "auto";
        }
      }
    };

    updateZoomControlPosition();
  }, [t("language")]);

  return (
    <div className="h-full w-full relative">
      <ControlFunctions
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        setOpenHelpForm={setOpenHelpForm}
      />

      <div
        className={clsx(
          "absolute top-4 z-[1000]",
          t("language").toLowerCase() === "en" ? "right-[10px]" : "left-[10px]"
        )}
      >
        <WebsiteTitleSec />

        <DropdownPlacesOptionsMenu
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />
      </div>

      <MapContainer
        center={[21.758334, 39.056873]}
        zoom={12}
        maxZoom={15}
        minZoom={12}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        style={{ height: "100vh", width: "100vw" }}
      >
        {/* <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        /> */}

        {/* <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        /> */}

        {/* <TileLayer
          url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png"
          attribution='Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        /> */}

        {/* NICE */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
        />

        {/* <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
        /> */}

        {/* <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        /> */}

        {projects.map((project, idx) => (
          <AlwaysOpenPopup
            key={project.id}
            position={[Number(project.lat), Number(project.lng)]}
            project={project}
          >
            {project.name}
          </AlwaysOpenPopup>
        ))}
        {selectedTypes.length &&
          filteredLandmarks.map((landmark, idx) => (
            <Marker
              key={idx}
              position={landmark.position}
              icon={getCustomIcon(landmark.name, landmark.type)}
              eventHandlers={{
                mouseover: (e) => {
                  const marker = e.target;
                  marker.openPopup();
                },
                mouseout: (e) => {
                  const marker = e.target;
                  marker.closePopup();
                },
              }}
            >
              <Popup
                className={clsx(
                  "places-popup !h-2 !text-xs !rounded-full",
                  landmark.type == "educate"
                    ? "bg-[#8A93DD]"
                    : landmark.type == "mall"
                    ? "bg-[#FCB270]"
                    : landmark.type == "health"
                    ? "bg-[#EB7979]"
                    : "bg-[#8d8e93]"
                )}
                closeButton={false}
              >
                {landmark.name}
              </Popup>
            </Marker>
          ))}

          {selectedTypes.length &&
          filteredLandmarks1.map((landmark, idx) => (
            <Marker
              key={idx}
              position={landmark.position}
              icon={getCustomIcon1(landmark.name, landmark.type)}
              eventHandlers={{
                mouseover: (e) => {
                  const marker = e.target;
                  marker.openPopup();
                },
                mouseout: (e) => {
                  const marker = e.target;
                  marker.closePopup();
                },
              }}
            >
              <Popup
                className={clsx(
                  "places-popup !h-2 !text-xs !rounded-full",
                  landmark.type == "educate"
                    ? "bg-[#8A93DD]"
                    : landmark.type == "mall"
                    ? "bg-[#FCB270]"
                    : landmark.type == "health"
                    ? "bg-[#EB7979]"
                    : "bg-[#8d8e93]"
                )}
                closeButton={false}
              >
                {landmark.name}
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Need Help Form Popup */}
      <Dialog open={openHelpForm} onOpenChange={setOpenHelpForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl font-extrabold">
              {t("NeedHelp")}
            </DialogTitle>
          </DialogHeader>
          <NeedHelpForm setOpen={setOpenHelpForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Map;
