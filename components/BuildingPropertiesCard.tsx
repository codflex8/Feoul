import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";

interface BuildingPropertiesProps {
  type: string;
  status: string;
  category: string;
  rooms: number;
  bathrooms: number;
  buildingSpace: number;
  landSpace: number;
  price: number;
  open: boolean;
  setOpen: React.ComponentState
}

const BuildingPropertiesCard = ({ type, status, category, rooms, bathrooms, buildingSpace, landSpace, price, open, setOpen }: BuildingPropertiesProps) => {
  const t = useTranslations('BuildingViewPage');

  return (
    <div className="w-full md:w-64 bg-white shadow-md rounded-md overflow-hidden">
      <div className="bg-slate-600 text-white p-2 flex justify-between items-center rounded-t-md">
        <h3 className="text-sm font-semibold">{type}</h3>
        <Badge className="bg-green-500 hover:bg-green-400">{t(`${status}`)}</Badge>
      </div>

      <div className="p-4 grid grid-cols-2 gap-2 text-center">
        <div className="bg-gray-100 rounded-md p-1 shadow-sm">
          <span className="block text-xs text-gray-500">{t("Category")}</span>
          <span className="block text-sm font-bold text-gray-800"> {category}</span>
        </div>

        <div className="bg-gray-100 rounded-md p-1 shadow-sm">
          <span className="block text-xs text-gray-500">{t("Rooms")}</span>
          <span className="block text-sm font-bold text-gray-800">{rooms} غرف</span>
        </div>

        <div className="bg-gray-100 rounded-md p-1 shadow-sm">
          <span className="block text-xs text-gray-500">{t("Bathrooms")}</span>
          <span className="block text-sm font-bold text-gray-800">{bathrooms}</span>
        </div>

        <div className="bg-gray-100 rounded-md p-1 shadow-sm">
          <span className="block text-xs text-gray-500">{t("BuidingArea")}</span>
          <span className="block text-sm font-bold text-gray-800">{buildingSpace} {t("Meter")}</span>
        </div>

        <div className="bg-gray-100 rounded-md p-1 shadow-sm col-span-2">
          <span className="block text-xs text-gray-500">{t("LandArea")}</span>
          <span className="block text-sm font-bold text-gray-800">{landSpace} {t("Meter")}</span>
        </div>

        <div className="bg-green-100 rounded-md p-1 shadow-sm col-span-2">
          <span className="block text-xs text-gray-600">{t("Price")}</span>
          <span className="block font-semibold text-green-600 space-x-1">
            <span className="text-sm text-gray-500 ml-1">{t("StartFrom")}</span>
            {price}
            <span className="text-sm text-gray-500 mr-1">{t("Riyal")}</span>
          </span>
        </div>
      </div>

      <div className="p-3 pt-0">
        <Button onClick={() => setOpen(!open)} disabled={status === "saled" || status === "reserved"} className="block w-full bg-green-600 hover:bg-green-700">
          {t("AddInterest")}
        </Button>
      </div>
    </div>
  );

};

export default BuildingPropertiesCard;
