"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";

interface FloorDesignsPopupProps {
  floorDesigns: { id: string; imageUrl: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export default function FloorDesignsPopup({
  floorDesigns,
  isOpen,
  onClose,
}: FloorDesignsPopupProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);

  const currentFloor =
    current === 0
      ? "الطابق الأرضي"
      : current === 1
      ? "الطابق الأول"
      : current === 2
      ? "الطابق الثاني"
      : current === 3
      ? "الطابق الثالث"
      : current === 4
      ? "الطابق الرابع"
      : "الطابق الخامس";

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[700px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            تصميم الطوابق
          </DialogTitle>
        </DialogHeader>
        <Carousel
          orientation="vertical"
          opts={{ loop: true }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="h-[400px]">
            {floorDesigns?.length ? (
              floorDesigns.map((floor,index) => (
                <CarouselItem key={floor.id}>
                  <img
                    src={`http://18.116.28.100${floor.imageUrl}`}
                    alt={`تصميم الطابق`}
                    className="w-full h-auto rounded-lg"
                  />
                </CarouselItem>
              ))
            ) : (
              <p className="text-center">لا توجد تصميمات متوفرة</p>
            )}
          </CarouselContent>
          <CarouselPrevious className="left-7 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="right-0 top-1/2 transform -translate-y-1/2" />
        </Carousel>
        <div className="flex justify-between mt-4">
          <Badge className="text-base font-medium">{currentFloor}</Badge>
          <div className="flex justify-end gap-4 mt-4">
            <Button>إضافة</Button>
            <Button onClick={onClose}>إغلاق</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
