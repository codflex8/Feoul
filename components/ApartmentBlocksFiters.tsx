import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Slider from "react-slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "./ui/badge";
import { UnitsFilters, UnitStatus, UnitStatusEnum } from "@/types/map.types";
import CategorySelect from "./CategorySelect";

interface ApartmentBlocksFitersProps {
  className: string;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  unitsFilters: UnitsFilters;
  setUnitsFilters: React.Dispatch<React.SetStateAction<UnitsFilters>>;
  unitsCount: number;
}

const ApartmentBlocksFiters = ({
  className,
  selectedCategories,
  setSelectedCategories,
  unitsFilters,
  setUnitsFilters,
  unitsCount,
}: ApartmentBlocksFitersProps) => {
  const t = useTranslations("ProjectPage");
  const priceRange = unitsFilters.unitsPriceRange;
  const spaceRange = unitsFilters.unitsSpaceRange;

  const handleShowAllBtn = () => {
    setSelectedCategories((prev: string[]) =>
      prev.includes("category-a") &&
      prev.includes("category-b") &&
      prev.includes("category-c") &&
      prev.includes("category-d")
        ? []
        : ["category-a", "category-b", "category-c", "category-d"]
    );
  };

  return (
    <div
      className={clsx(
        "w-fit bg-slate-600 rounded-md px-4 transition-all ease-in-out overflow-hidden",
        className
      )}
    >
      <Tabs
        dir={t("language").toLowerCase() === "en" ? "rtl" : "ltr"}
        defaultValue={UnitStatusEnum.available}
        className="w-fit bg-slate-600 rounded-md"
        value={unitsFilters.unitStatus}
        onValueChange={(value) => {
          setUnitsFilters((prevFilters) => ({
            ...prevFilters,
            unitStatus: value as UnitStatus,
          }));
        }}
      >
        <TabsList className="grid w-full grid-cols-3 bg-slate-600">
          <TabsTrigger value={UnitStatusEnum.available} className="text-white">
            {t("Avaliable")}
          </TabsTrigger>
          <TabsTrigger disabled value={UnitStatusEnum.reserved} className="text-white">
            {t("Bocked")}
          </TabsTrigger>
          <TabsTrigger disabled value={UnitStatusEnum.saled} className="text-white">
            {t("Sold")}
          </TabsTrigger>
        </TabsList>

        {[UnitStatusEnum.available, UnitStatusEnum.reserved, UnitStatusEnum.saled].map(
          (status) => (
            <TabsContent key={status} value={status} className="pb-4 pt-0 mt-0">
              <hr className="mb-2" />
              <h1 className="text-sm font-semibold text-white mb-2">
                {unitsCount}{" "}
                {status === UnitStatusEnum.available
                  ? t("AvaliableBlocks")
                  : status === UnitStatusEnum.reserved
                  ? t("BockedBlocks")
                  : t("SoldBlocks")}
              </h1>
              <CategorySelect
                categories={selectedCategories}
                selectedCategory={unitsFilters.selectedCategory}
                onCategoryChange={(category) => {
                  setUnitsFilters((prevFilters) => ({
                    ...prevFilters,
                    selectedCategory: category,
                  }));
                }}
              />
            </TabsContent>
          )
        )}
      </Tabs>

      {/* price Range Slider */}
      <div className="py-2">
        <h1 className="font-bold text-sm text-gray-300 mb-8">
          {t("Price")}
          <Badge variant="secondary" className="mx-1">
            {t("Riyal")}
          </Badge>
        </h1>

        <Slider
          className="w-full h-2 bg-gray-300 rounded-md"
          thumbClassName="relative h-4 w-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform"
          trackClassName="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-md"
          value={priceRange.sliderValue}
          onChange={(newValues) => {
            setUnitsFilters((prevFilters) => ({
              ...prevFilters,
              unitsPriceRange: {
                ...prevFilters.unitsPriceRange,
                sliderValue: newValues,
              },
            }));
          }}
          min={priceRange.minPrice}
          max={priceRange.maxPrice}
          step={1000}
          renderThumb={(props, state) => {
            const { key, ...rest } = props;
            return (
              <div
                key={key}
                {...rest}
                className="relative h-4 w-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-sm shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform top-[50%] transform translate-y-[-50%]"
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-semibold">
                  {state.valueNow}
                </span>
              </div>
            );
          }}
        />
      </div>

      {/* Space Range Slider */}
      <div className="py-2">
        <h1 className="font-bold text-sm text-gray-300 mb-8">
          {t("TotalArea")}
          <Badge variant="secondary" className="mx-1">
            {t("Meter")}
          </Badge>
        </h1>

        <Slider
          className="w-full h-2 bg-gray-300 rounded-md"
          thumbClassName="relative h-4 w-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform"
          trackClassName="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-md"
          value={spaceRange.sliderValue}
          onChange={(newValues) => {
            setUnitsFilters((prevFilters) => ({
              ...prevFilters,
              unitsSpaceRange: {
                ...prevFilters.unitsSpaceRange,
                sliderValue: newValues,
              },
            }));
          }}
          min={spaceRange.minSpace}
          max={spaceRange.maxSpace}
          step={10}
          renderThumb={(props, state) => {
            const { key, ...rest } = props;
            return (
              <div
                key={key}
                {...rest}
                className="relative h-4 w-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-sm shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform top-[50%] transform translate-y-[-50%]"
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-semibold">
                  {state.valueNow}
                </span>
              </div>
            );
          }}
        />
      </div>

      {/* Show All Button */}
      <Button
        variant="showALl"
        className={clsx(
          "w-full mt-4 bg-gradient-to-r from-blue-400 to-purple-500 transition-all",
          selectedCategories.includes("category-a") &&
            selectedCategories.includes("category-b") &&
            selectedCategories.includes("category-c") &&
            selectedCategories.includes("category-d") &&
            "!bg-white bg-none text-slate-600 !important"
        )}
        onClick={handleShowAllBtn}
      >
        {t("ShowAll")}
      </Button>
    </div>
  );
};

export default ApartmentBlocksFiters;