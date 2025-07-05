"use client";

import ControlFunctions from "@/components/ControlFunctions";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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
import InterestedForm from "@/components/form/InterestedForm";
import NeedHelpForm from "@/components/form/NeedHelpForm";
import { Apartment } from "@/types/map.types";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const ApartmentViewPage = ({ apartment }: { apartment: Apartment }) => {
  const t = useTranslations("BuildingViewPage");

  const [scale, setScale] = useState<number>(1);
  const [openInterestedForm, setOpenInterestedForm] = useState<boolean>(false);
  const [openHelpForm, setOpenHelpForm] = useState<boolean>(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const zoomStep = 0.1;
  const searchParams = useSearchParams();
  const projectName = searchParams.get("projectName") ?? "No Name";
  const projectId = searchParams.get("projectId") ?? "No ID";
  const images = apartment.type.images || [];
  const background = apartment.building.buildingType.buildingImage;
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

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="bg-[#4b5d6e75] relative text-center min-h-[100vh] w-screen flex items-center justify-center py-2 overflow-x-hidden">
     
      {/* Blurred Background Image */}
    <div className="absolute inset-0 z-0">
      <Image
        src={`http://13.59.197.112${background}`}
        alt="Background"
        fill
        className="object-cover w-full h-full filter blur-md opacity-30"
      />
    </div>

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
          projectName={projectName}
          projectId={projectId}
          blockNumber={apartment.number}
        />
      </div>

      {/* Apartment Properties Block */}
      <div
        className={clsx(
          "absolute top-24 z-[1000] hidden md:block",
          t("language").toLowerCase() === "en" ? "right-[10px]" : "left-[10px]"
        )}
      >
        <div className="w-64 bg-white shadow-md rounded-md overflow-hidden">
          <div className="bg-slate-600 text-white p-2 flex justify-between items-center rounded-t-md">
            <h3 className="text-sm font-semibold">{apartment.name}</h3>
            <span className="text-xs">{t(`${apartment.status}`)}</span>
          </div>

          <div className="p-4 grid grid-cols-2 gap-2 text-center">
            <div className="bg-gray-100 rounded-md p-1 shadow-sm">
              <span className="block text-xs text-gray-500">{t("Rooms")}</span>
              <span className="block text-sm font-bold text-gray-800">
                {apartment.type.bedroomsNumber}
              </span>
            </div>

            <div className="bg-gray-100 rounded-md p-1 shadow-sm">
              <span className="block text-xs text-gray-500">
                {t("Bathrooms")}
              </span>
              <span className="block text-sm font-bold text-gray-800">
                {apartment.type.bathroomsNumber}
              </span>
            </div>

            <div className="bg-gray-100 rounded-md p-1 shadow-sm">
              <span className="block text-xs text-gray-500">
                {t("BuidingArea")}
              </span>
              <span className="block text-sm font-bold text-gray-800">
                {apartment.type.area} {t("Meter")}
              </span>
            </div>

            <div className="bg-gray-100 rounded-md p-1 shadow-sm">
              <span className="block text-xs text-gray-500">
                {t("LandArea")}
              </span>
              <span className="block text-sm font-bold text-gray-800">
                {apartment.type.area} {t("Meter")}
              </span>
            </div>

            <div className="bg-green-100 rounded-md p-1 shadow-sm col-span-2">
              <span className="block text-xs text-gray-600">{t("Price")}</span>
              <span className="block font-semibold text-green-600 space-x-1">
                <span className="text-sm text-gray-500 ml-1">
                  {t("StartFrom")}
                </span>
                {apartment.type.price}
                <span className="text-sm text-gray-500 mr-1">{t("Riyal")}</span>
              </span>
            </div>
          </div>

          <div className="p-3 pt-0">
            <Button
              onClick={() => setOpenInterestedForm(true)}
              disabled={
                apartment.status === "saled" || apartment.status === "reserved"
              }
              className="block w-full bg-green-600 hover:bg-green-700"
            >
              {t("AddInterest")}
            </Button>
          </div>
        </div>
      </div>

      {/* Apartment Images Carousel */}
      <div className="mx-auto mt-auto md:m-auto relative">
        {/* <Carousel
          orientation="vertical"
          opts={{ loop: true }}
          setApi={setApi}
          dir="rtl"
          className={`w-[500px] max-w-[90%] m-auto h-full transform transition-all scale-${scale} rounded-md`}
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <CarouselContent className="min-h-[300px] h-[100vh] md:h-[80vh] rounded-md max-w-[90%] m-auto">
            {images.length > 0 ? (
               images.map(({ src, title }, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={`http://13.59.197.112${src}`}
                    alt={title}
                    className="h-full w-full rounded-md object-cover"
                    width={400}
                    height={1000}
                  />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="h-full w-full rounded-md bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">لا توجد صور متاحة</p>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <Button
            className="bg-slate-600 hover:bg-slate-700 p-2 absolute top-[50%] transform translate-y-[-50%] -left-8 hidden sm:inline-flex"
            onClick={() => api?.scrollTo(current - 1)}
          >
            <Image
              src="/assets/icons/left-arrow.svg"
              alt="arrow"
              width={25}
              height={32}
            />
          </Button>
          <Button
            className="bg-slate-600 hover:bg-slate-700 p-2 absolute top-[50%] transform translate-y-[-50%] -right-8 hidden sm:inline-flex"
            onClick={() => api?.scrollTo(current + 1)}
          >
            <Image
              src="/assets/icons/left-arrow.svg"
              alt="arrow"
              width={25}
              height={32}
              className="transform rotate-180"
            />
          </Button>
        </Carousel> */}

        <Image
          src={`http://13.59.197.112${images[0]}`}
          className="h-full w-full rounded-md object-cover"
          width={400}
          height={1000}
        />

        <div className="flex items-center justify-center gap-4 mt-4 md:mt-8">
          <Link href={`/ar/real-estate/${projectId}/residential-buildings`}>
            <Button className="font-semibold">العودة إلى المشروع</Button>
          </Link>
          <Link
            href={`/ar/real-estate/${projectId}/residential-buildings/building-view/${apartment.building.id}`}
          >
            <Button variant="outline" className="font-semibold">
              العودة إلى العمارة
            </Button>
          </Link>
        </div>
      </div>

      {/* Interest Form Popup */}
      <Dialog open={openInterestedForm} onOpenChange={setOpenInterestedForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl font-extrabold">
              {t("AddInterest")}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-100 rounded-md p-1 shadow-sm">
              <span className="block text-xs text-gray-500">{t("Rooms")}</span>
              <span className="block text-sm font-bold text-gray-800">
                {apartment.type.bedroomNumber}
              </span>
            </div>

            <div className="bg-gray-100 rounded-md p-1 shadow-sm">
              <span className="block text-xs text-gray-500">
                {t("Bathrooms")}
              </span>
              <span className="block text-sm font-bold text-gray-800">
                {apartment.type.bathroomNumber}
              </span>
            </div>

            <div className="bg-gray-100 rounded-md p-1 shadow-sm">
              <span className="block text-xs text-gray-500">{t("Price")}</span>
              <span className="font-bold gray-800">
                {apartment.type.price}{" "}
                <span className="text-sm">{t("Riyal")}</span>
              </span>
            </div>
          </div>
          <InterestedForm
            setOpen={setOpenInterestedForm}
            apartmentId={apartment.id}
          />
        </DialogContent>
      </Dialog>

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

export default ApartmentViewPage;
