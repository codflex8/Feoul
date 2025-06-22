"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import ControlFunctions from "@/components/ControlFunctions";
import WebsiteTitleSec from "@/components/WebsiteTitleSec";
import BuildingBlocksFiters from "@/components/BuildingBlocksFiters";
import HelppingTools from "@/components/HelppingTools";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NeedHelpForm from "@/components/form/NeedHelpForm";
import {
  Project,
  ResidentialBuilding,
  BuildingsData,
  BuildingsFilters,
  UnitStatusEnum,
} from "@/types/map.types";

import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ResidentialBuildingMarker from "./ResidentialBuildingMarker";

const imageUrl = "/assets/images/project.jpg";

const ResidentialBuildingsPage = ({
  project,
  buildingTypes,
  buildingsData,
}: {
  project: Project;
  buildingTypes: string[];
  buildingsData: BuildingsData;
}) => {
  const t = useTranslations("ProjectPage");

  let imageBounds: L.LatLngBoundsExpression = [
    [0, 0],
    [450, 800],
  ];

  const [buildingsFilters, setBuildingsFilters] = useState<BuildingsFilters>({
    buildingStatus: UnitStatusEnum.available,
    buildingsPriceRange: {
      ...buildingsData.buildingsPriceRange,
      sliderValue: [
        buildingsData.buildingsPriceRange.minPrice,
        buildingsData.buildingsPriceRange.maxPrice,
      ],
    },
    buildingsSpaceRange: {
      ...buildingsData.buildingsSpaceRange,
      sliderValue: [
        buildingsData.buildingsSpaceRange.minSpace,
        buildingsData.buildingsSpaceRange.maxSpace,
      ],
    },
    selectedBuildingType: "All",
  });

  const getRenderedBuildings = () => {
    let buildings = buildingsData.avaliableBuildings;
    const filteredStatus = buildingsFilters.buildingStatus;
    const filteredPriceRange = buildingsFilters.buildingsPriceRange;
    const filteredSpaceRange = buildingsFilters.buildingsSpaceRange;
    const selectedBuildingType = buildingsFilters.selectedBuildingType;

    if (filteredStatus === "reserved") {
      buildings = buildingsData.reverseBuildings;
    } else if (filteredStatus === "saled") {
      buildings = buildingsData.saledBuildings;
    }

    if (selectedBuildingType !== "All") {
      buildings = buildings.filter((building) => building.buildingType.name === selectedBuildingType);
    }

    const minPrice = filteredPriceRange.sliderValue[0];
    const maxPrice = filteredPriceRange.sliderValue[1];
    const minSpace = filteredSpaceRange.sliderValue[0];
    const maxSpace = filteredSpaceRange.sliderValue[1] + 100;

    // تطبيق فلاتر السعر والمساحة حسب الحاجة
    // buildings = buildings.filter(
    //   (building) => building.price >= minPrice && building.price <= maxPrice
    // );

    return buildings;
  };

  const renderedBuildings = getRenderedBuildings();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedBuildingTypes, setSelectedBuildingTypes] = useState(buildingTypes);
  const [openHelpForm, setOpenHelpForm] = useState<boolean>(false);

  const handleShowBuildigsFilters = () => {
    setShowFilters((prev) => !prev);
  };

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

  return (
    <div className="bg-[#544533] relative text-center min-h-[100vh] w-screen flex items-center justify-center overflow-x-hidden">
      <ControlFunctions
        selectedCategories={selectedBuildingTypes}
        setSelectedCategories={setSelectedBuildingTypes}
        setOpenHelpForm={setOpenHelpForm}
      />

      <div
        className={clsx(
          "absolute top-4 z-[1000]",
          t("language").toLowerCase() === "en" ? "right-[10px]" : "left-[10px]"
        )}
      >
        <WebsiteTitleSec projectId={project.id} projectName={project.name} />

        <div className="w-fit">
          <Button
            className="w-full !bg-slate-600 text-white !justify-between"
            onClick={handleShowBuildigsFilters}
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

          {/* Filters block */}
          <BuildingBlocksFiters
            className={
              showFilters ? "max-h-[800] py-2" : "max-h-0"
            }
            selectedCategories={selectedBuildingTypes}
            setSelectedCategories={setSelectedBuildingTypes}
            unitsFilters={buildingsFilters}
            setUnitsFilters={setBuildingsFilters}
            unitsCount={renderedBuildings.length}
          />
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
          {renderedBuildings.map((building) => (
            <ResidentialBuildingMarker key={building.id} building={building} />
          ))}
        </MapContainer>
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

export default ResidentialBuildingsPage;