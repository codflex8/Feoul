import { useRouter, usePathname } from "next/navigation";
import { Popup } from "react-leaflet";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InterestedForm from "@/components/form/InterestedForm";

type Props = {
  apartment: any;
};

const ApartmentPopup = ({ apartment }: Props) => {
  const pathname = usePathname();
  const { push } = useRouter();
  const t = useTranslations("BuildingViewPage");
  const [openInterestedForm, setOpenInterestedForm] = useState(false);

  return (
    <>
      <Popup className="min-w-64">
        <div className="text-sm">
          <h6 className="text-base font-bold flex items-center justify-between">
            <span>{apartment.name}</span>
            <span className="text-xs text-gray-500">{t(`${apartment.status}`)}</span>
          </h6>
          <p className="flex items-center justify-between !my-0 mb-2">
            {apartment.bedroomNumber} {t("Bedrooms")}, {apartment.bathroomNumber}{" "}
            {t("Bathrooms")}
          </p>
          <p className="flex items-center justify-between !my-0">
            <span>{t("BuidingArea")}:</span>
            <span>
              {apartment.buildSpace} {t("Meter")}
            </span>
          </p>
          <p className="flex items-center justify-between !my-0">
            <span>{t("LandArea")}:</span>
            <span>
              {apartment.landSpace} {t("Meter")}
            </span>
          </p>
          <p className="flex items-center justify-between !my-0">
            <span>{t("Price")}:</span>
            <span className="text-sm text-gray-500 ml-1">{t("StartFrom")}</span>
            <span>
              {apartment.price} {t("Riyal")}
            </span>
          </p>
        </div>
        <Button
          className="w-full mt-1"
          onClick={() => push(`${pathname}/apartment-view/${apartment.id}`)}
        >
          عرض الشقة السكنية
        </Button>
        <Button
          className="w-full mt-1 bg-green-600 hover:bg-green-700"
          onClick={() => setOpenInterestedForm(true)}
          disabled={apartment.status === "saled" || apartment.status === "reserved"}
        >
          {t("AddInterest")}
        </Button>
      </Popup>

      {/* نافذة سجل اهتمامك */}
      <Dialog open={openInterestedForm} onOpenChange={setOpenInterestedForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl font-extrabold">
              {t("AddInterest")}
            </DialogTitle>
          </DialogHeader>
          <InterestedForm setOpen={setOpenInterestedForm} apartmentId={apartment.id} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApartmentPopup;