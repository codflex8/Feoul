"use client";

import ControlFunctions from "@/components/ControlFunctions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import clsx from "clsx";

import WebsiteTitleSec from "@/components/WebsiteTitleSec";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import NeedHelpForm from "@/components/form/NeedHelpForm";

import {
  MapContainer,
  ImageOverlay,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ResidentialBuilding } from "@/types/map.types";
import ApartmentMarker from "./ApartmentMarker";

const imageUrl = "/assets/images/project.jpg";

const ResidentialBuildingViewPage = ({ building }: { building: ResidentialBuilding }) => {
  const t = useTranslations("BuildingViewPage");

  const [scale, setScale] = useState<number>(1);
  const [openHelpForm, setOpenHelpForm] = useState<boolean>(false);

  const zoomStep = 0.1;

  const zoomIn = () => {
    if (scale <= 1) {
      setScale((prev) => prev + zoomStep);
    }
  };

  const zoomOut = () => {
    if (scale <= 2 && scale >= 0.6) {
      setScale((prev) => (prev > zoomStep ? prev - zoomStep : prev));
    }
  };

  let imageBounds: L.LatLngBoundsExpression = [
    [0, 0],
    [450, 800],
  ];

  const FitBoundsToImage = ({
    bounds,
  }: {
    bounds: L.LatLngBoundsExpression;
  }) => {
    const map = useMap();

    React.useEffect(() => {
      map.fitBounds(bounds, { padding: [20, 20] });
    }, [map, bounds]);

    return null;
  };

  // بيانات وهمية للشقق - في التطبيق الحقيقي ستأتي من الـ API
  const apartments = [
    {
      id: "1",
      number: 101,
      name: "شقة 101",
      position: [200, 300],
      status: "available",
      price: 500000,
      bedroomNumber: 3,
      bathroomNumber: 2,
      buildSpace: 120,
      landSpace: 150,
    },
    {
      id: "2", 
      number: 102,
      name: "شقة 102",
      position: [250, 350],
      status: "reserved",
      price: 550000,
      bedroomNumber: 4,
      bathroomNumber: 3,
      buildSpace: 140,
      landSpace: 170,
    },
  ];

  return (
    <div className="bg-[#4b5d6e75] relative text-center min-h-[100vh] w-screen flex items-center justify-center py-2 overflow-x-hidden">
      {/* Website Control Functions */}
      <ControlFunctions
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        setOpenHelpForm={setOpenHelpForm}
      />

      {/* Website Title Section */}
      <div
        className={clsx(
          "absolute top-4 z-[1000]",
          t("language").toLowerCase() === "en" ? "right-[10px]" : "left-[10px]"
        )}
      >
        <WebsiteTitleSec
          projectName={building.project.name}
          projectId={building.project.id}
          blockNumber={Number(building.name.split(' ')[1]) || 0}
        />
      </div>

      {/* Building Info Card */}
      <div
        className={clsx(
          "absolute top-24 z-[1000] hidden md:block",
          t("language").toLowerCase() === "en" ? "right-[10px]" : "left-[10px]"
        )}
      >
        <div className="w-64 bg-white shadow-md rounded-md overflow-hidden">
          <div className="bg-slate-600 text-white p-2 flex justify-between items-center rounded-t-md">
            <h3 className="text-sm font-semibold">{building.name}</h3>
            <span className="text-xs">{building.buildingType?.name}</span>
          </div>
          <div className="p-4">
            <img 
              src={building.image} 
              alt={building.name}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <p className="text-sm text-gray-600">
              المشروع: {building.project.name}
            </p>
            <p className="text-sm text-gray-600">
              الحالة: {building.status}
            </p>
          </div>
        </div>
      </div>

      {/* Building View */}
      <div className="mx-auto mt-auto md:m-auto relative">
        <div className="w-[500px] max-w-[90%] m-auto h-full rounded-md"
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <div className="min-h-[300px] h-[100vh] md:h-[80vh] rounded-md max-w-[90%] m-auto">
            <MapContainer
              center={[225, 400]}
              zoom={1}
              minZoom={1}
              maxZoom={4}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              crs={L.CRS.Simple}
              maxBounds={imageBounds}
              maxBoundsViscosity={1.0}
            >
              <ImageOverlay url={building.image} bounds={imageBounds} />
              <FitBoundsToImage bounds={imageBounds} />
              {apartments.map((apartment) => (
                <ApartmentMarker key={apartment.id} apartment={apartment} />
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 md:mt-8">
          <Link href={`/ar/real-estate/${building.project.id}/residential-buildings`}>
            <Button className="font-semibold">
              العودة إلى المشروع
            </Button>
          </Link>
          <Button variant="outline" className="font-semibold">
            عرض معلومات العمارة
          </Button>
        </div>
      </div>

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

export default ResidentialBuildingViewPage;