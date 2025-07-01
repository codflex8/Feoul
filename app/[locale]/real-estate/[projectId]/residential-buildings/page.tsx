"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WebsiteTitleSec from "@/components/WebsiteTitleSec";
import ControlFunctions from "@/components/ControlFunctions";
import HelppingTools from "@/components/HelppingTools";
import NeedHelpForm from "@/components/form/NeedHelpForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchResidentialBuildings } from "@/lib/actions/map.actions";
import { ResidentialBuilding } from "@/types/map.types";
import { useParams } from "next/navigation";
import ResidentialBuildingMarker from "./ResidentialBuildingMarker";

const imageBounds: L.LatLngBoundsExpression = [
  [0, 0],
  [450, 800],
];

const ResidentialBuildingsPage = () => {
  const [residentialBuildings, setResidentialBuildings] = useState<ResidentialBuilding[]>([]);
  const [selectedBuildingType, setSelectedBuildingType] = useState("All");
  const [buildingTypes, setBuildingTypes] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  let [projectId, setProjectId] = useState<string>("معرف غير معروف");
   const [projectName, setProjectName] = useState<string>("اسم غير معروف");
  const [openHelpForm, setOpenHelpForm] = useState(false);
const params = useParams();
 projectId = params?.projectId as string;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const buildings = await fetchResidentialBuildings(projectId);
        setResidentialBuildings(buildings);

        if (buildings.length > 0) {
          const firstProject = buildings[0].project;
          if (firstProject) {
            setProjectId(firstProject.id);
            setProjectName(firstProject.name);
            if (firstProject.projectDocUrl) {
              setImageUrl(`http://13.59.197.112${firstProject.projectDocUrl}`);
            }
          }
        }

        const types = Array.from(
          new Set(buildings.map((b) => b.buildingType?.name).filter(Boolean))
        );
        setBuildingTypes(types);
      } catch (err) {
        console.error("خطأ في تحميل العمارات:", err);
      }
    };

    fetchData();
  }, []);

  const filteredBuildings =
    selectedBuildingType === "All"
      ? residentialBuildings
      : residentialBuildings.filter(
          (b) => b.buildingType?.name === selectedBuildingType
        );

  const FitBoundsToImage = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
    const map = useMap();
    useEffect(() => {
      map.fitBounds(bounds, { padding: [20, 20] });
    }, [map, bounds]);
    return null;
  };

  return (
    <div className="bg-[#544533] relative text-center min-h-[100vh] w-screen flex items-center justify-center overflow-x-hidden">
      <ControlFunctions
        selectedCategories={[]}
        setSelectedCategories={() => {}}
        setOpenHelpForm={setOpenHelpForm}
      />

      <div className="absolute top-4 z-[1000] right-4">
        <WebsiteTitleSec
          projectId={projectId}
          projectName={projectName}
        />

        <div className="w-fit mt-2">
          <p className="text-white mb-1">نوع العمارة</p>
          <Select
            onValueChange={(val) => setSelectedBuildingType(val)}
            value={selectedBuildingType}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">الكل</SelectItem>
              {buildingTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <HelppingTools />

      <div className="w-screen h-[100vh]">
        <MapContainer
          center={[500, 500]}
          zoom={1}
          minZoom={1}
          maxZoom={2}
          scrollWheelZoom={true}
          style={{ height: "100vh", width: "100%" }}
          crs={L.CRS.Simple}
          maxBounds={imageBounds}
          maxBoundsViscosity={1.0}
        >
          <ImageOverlay url={imageUrl} bounds={imageBounds} />
          <FitBoundsToImage bounds={imageBounds} />

          {filteredBuildings.map((building) => (
             <ResidentialBuildingMarker key={building.id} building={building} />
          ))}
        </MapContainer>
      </div>

      <Dialog open={openHelpForm} onOpenChange={setOpenHelpForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">
              هل تحتاج مساعدة؟
            </DialogTitle>
          </DialogHeader>
          <NeedHelpForm setOpen={setOpenHelpForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResidentialBuildingsPage;
