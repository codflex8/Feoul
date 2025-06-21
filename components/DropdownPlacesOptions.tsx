import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import clsx from "clsx";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { useState } from "react"; 


const DropdownPlacesOptionsMenu = ({ selectedTypes, setSelectedTypes }: { selectedTypes: string[], setSelectedTypes: React.ComponentState}) => {
  const t = useTranslations('MapPage');
  const [isOpen, setIsOpen] = useState(false);

  const handleShowAllBtn = () => {
    setSelectedTypes((prev: string[]) => (
      prev.includes("landmark") &&
      prev.includes("hospital") &&
      prev.includes("mall") &&
      prev.includes("airport") &&
      prev.includes("mosque") &&
      prev.includes("educate") &&
      prev.includes("sport")
        ? []
        : ["landmark", "hospital", "mall", "airport", "mosque", "educate", "sport"]
    ));
  }

  const toggleType = (type: string) => {
    setSelectedTypes((prev: string[]) =>
      prev.includes(type) ? prev.filter((t: string ) => t !== type) : [...prev, type]
    );
  };

return (
  <div className="relative">
     {/* ✅ زر الفتح والإغلاق */}
     <button 
        className="absolute top-0 right-0 text-slate-200 bg-slate-800 w-8 h-8  text-lg  rounded-full transition-transform duration-300" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
      >
        +
      </button>

      {isOpen && (
  <div className="flex flex-col bg-slate-600 py-4 px-8 rounded-md gap-3 w-fit">
    <h3 className="font-semibold text-sm text-center text-white">{t("MapOptions")}</h3>
    <Button variant="showALl"
      className={clsx(
        selectedTypes.includes("places") &&
        selectedTypes.includes("educate") &&
        selectedTypes.includes("mall") &&
        selectedTypes.includes("health") &&
        "bg-white text-slate-600"
      )}
      onClick={handleShowAllBtn}>{t("ShowAll")}</Button>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-6">
          <span>{t("MapPlaces")}</span>
          <Image
            src='/assets/icons/right-arrow.svg'
            alt="arrow"
            width={10}
            height={10}
            className="transform rotate-90 -translate-y-[1px]"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 !z-[1000]">
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
  className={clsx("flex items-center justify-between mb-1 cursor-pointer", selectedTypes.includes("landmark") && 'bg-slate-400')}
  checked={selectedTypes.includes("landmark")}
  onCheckedChange={() => toggleType("landmark")}
>
  <span className="block text-base text-slate-500 font-semibold">{t("Landmarks")}</span>
  <i className="fas fa-map-marker-alt text-lg text-red-500"></i>
</DropdownMenuCheckboxItem>

<DropdownMenuCheckboxItem
  className={clsx("flex items-center justify-between mb-1 cursor-pointer", selectedTypes.includes("hospital") && 'bg-slate-400')}
  checked={selectedTypes.includes("hospital")}
  onCheckedChange={() => toggleType("hospital")}
>
  <span className="block text-base text-slate-500 font-semibold">{t("Hospitals")}</span>
  <i className="fas fa-hospital text-lg text-blue-500"></i>
</DropdownMenuCheckboxItem>

<DropdownMenuCheckboxItem
  className={clsx("flex items-center justify-between mb-1 cursor-pointer", selectedTypes.includes("mall") && 'bg-slate-400')}
  checked={selectedTypes.includes("mall")}
  onCheckedChange={() => toggleType("mall")}
>
  <span className="block text-base text-slate-500 font-semibold">{t("Malls")}</span>
  <i className="fas fa-shopping-cart text-lg text-green-500"></i>
</DropdownMenuCheckboxItem>

<DropdownMenuCheckboxItem
  className={clsx("flex items-center justify-between mb-1 cursor-pointer", selectedTypes.includes("airport") && 'bg-slate-400')}
  checked={selectedTypes.includes("airport")}
  onCheckedChange={() => toggleType("airport")}
>
  <span className="block text-base text-slate-500 font-semibold">{t("Airports")}</span>
  <i className="fas fa-plane text-lg text-purple-500"></i>
</DropdownMenuCheckboxItem>

<DropdownMenuCheckboxItem
  className={clsx("flex items-center justify-between mb-1 cursor-pointer", selectedTypes.includes("mosque") && 'bg-slate-400')}
  checked={selectedTypes.includes("mosque")}
  onCheckedChange={() => toggleType("mosque")}
>
  <span className="block text-base text-slate-500 font-semibold">{t("Mosques")}</span>
  <i className="fas fa-mosque text-lg text-yellow-500"></i>
</DropdownMenuCheckboxItem>

<DropdownMenuCheckboxItem
  className={clsx("flex items-center justify-between mb-1 cursor-pointer", selectedTypes.includes("educate") && 'bg-slate-400')}
  checked={selectedTypes.includes("educate")}
  onCheckedChange={() => toggleType("educate")}
>
  <span className="block text-base text-slate-500 font-semibold">{t("Educate")}</span>
  <i className="fas fa-university text-lg text-orange-500"></i>
</DropdownMenuCheckboxItem>

<DropdownMenuCheckboxItem
  className={clsx("flex items-center justify-between mb-1 cursor-pointer", selectedTypes.includes("sport") && 'bg-slate-400')}
  checked={selectedTypes.includes("sport")}
  onCheckedChange={() => toggleType("sport")}
>
  <span className="block text-base text-slate-500 font-semibold">{t("Sports")}</span>
  <i className="fas fa-futbol text-lg text-gray-500"></i>

</DropdownMenuCheckboxItem>

      </DropdownMenuContent>
    </DropdownMenu>
  </div>
   )}
  </div>
)
}

export default DropdownPlacesOptionsMenu;