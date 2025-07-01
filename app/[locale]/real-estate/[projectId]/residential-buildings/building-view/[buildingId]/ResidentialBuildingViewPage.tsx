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
import { useEffect, useState } from "react";
import NeedHelpForm from "@/components/form/NeedHelpForm";
import { useParams, useSearchParams } from "next/navigation";
import { getApartment } from "@/lib/actions/map.actions";
import { Apartment } from "@/types/map.types";
import { MapContainer, ImageOverlay, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ResidentialBuilding } from "@/types/map.types";
import ApartmentMarker from "./ApartmentMarker";
import BuildingBlocksFiters from "@/components/BuildingBlocksFiters";
import { UnitsFilters, UnitStatusEnum } from "@/types/map.types";
import React from "react";

const imageUrl = "/assets/images/project.jpg";

const ResidentialBuildingViewPage = ({
  building,
}: {
  building: ResidentialBuilding;
}) => {
  const t = useTranslations("BuildingViewPage");
  const searchParams = useSearchParams();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [scale, setScale] = useState<number>(1);
  const [openHelpForm, setOpenHelpForm] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const params = useParams();
  const zoomStep = 0.1;

  const projectName = searchParams.get("projectName");
  const projectId = searchParams.get("projectId");
  const imageBuilding = searchParams.get("image");
  const buildingId = params.buildingId as string;

  const [unitsFilters, setUnitsFilters] = useState<UnitsFilters>({
    unitStatus: UnitStatusEnum.available,
    unitsPriceRange: {
      minPrice: 0,
      maxPrice: 10000,
      sliderValue: [0, 10000],
    },
    unitsSpaceRange: {
      minSpace: 0,
      maxSpace: 1000,
      sliderValue: [0, 1000],
    },
    selectedCategory: "All",
  });

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

  const getFilteredApartments = () => {
    let filtered = [...apartments];
    const minPrice = unitsFilters.unitsPriceRange.sliderValue[0];
    const maxPrice = unitsFilters.unitsPriceRange.sliderValue[1];
    const minSpace = unitsFilters.unitsSpaceRange.sliderValue[0];
    const maxSpace = unitsFilters.unitsSpaceRange.sliderValue[1];

    filtered = filtered.filter((ap) => ap.price >= minPrice && ap.price <= maxPrice);
    filtered = filtered.filter((ap) => ap.buildSpace >= minSpace && ap.buildSpace <= maxSpace);
    return filtered;
  };

  useEffect(() => {
    const fetchApartments = async () => {
      if (!buildingId) return;
      try {
        const data = await getApartment(buildingId);
        setApartments(data);
      } catch (error) {
        console.error("فشل في جلب الشقق:", error);
      }
    };
    fetchApartments();
  }, [buildingId]);

  return (
    <div className="bg-[#4b5d6e75] relative text-center min-h-[100vh] w-screen flex items-center justify-center py-2 overflow-x-hidden">
      <ControlFunctions
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        setOpenHelpForm={setOpenHelpForm}
      />

      <div
        className={clsx(
          "absolute top-4 z-[1000]",
          t("language").toLowerCase() === "en" ? "right-[10px]" : "left-[10px]"
        )}
      >
        <WebsiteTitleSec
          projectName={projectName}
          projectId={projectId}
          blockNumber={apartments.length > 0 ? Number(apartments[0].building.number) : 'no'}
        />
        <div className="w-fit">
          <Button
            className="w-full !bg-slate-600 text-white !justify-between"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <span>فلاتر</span>
            <Image
              src="/assets/icons/left-arrow.svg"
              alt="arrow"
              width={32}
              height={32}
              className={clsx(
                "transition-all",
                showFilters ? "rotate-90" : "-rotate-90"
              )}
            />
          </Button>

          <BuildingBlocksFiters
            className={showFilters ? "max-h-[800] py-2" : "max-h-0"}
            selectedCategories={[]}
            setSelectedCategories={() => {}}
            unitsFilters={unitsFilters}
            setUnitsFilters={setUnitsFilters}
            unitsCount={getFilteredApartments().length}
          />
        </div>
      </div>

      <div className="mx-auto mt-auto md:m-auto relative">
        <div
          className="fixed inset-0 z-0"
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <MapContainer
            center={[225, 400]}
            zoom={1}
            minZoom={1}
            maxZoom={4}
            scrollWheelZoom={true}
            style={{ height: "100vh", width: "100vw" }}
            crs={L.CRS.Simple}
            maxBounds={imageBounds}
            maxBoundsViscosity={1.0}
          >
            {imageBuilding && (
              <ImageOverlay url={imageBuilding} bounds={imageBounds} />
            )}
            <FitBoundsToImage bounds={imageBounds} />
            {getFilteredApartments().map((apartment) => (
              <ApartmentMarker key={apartment.id} apartment={apartment} />
            ))}
          </MapContainer>
        </div>
      </div>

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