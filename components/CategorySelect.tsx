import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CategorySelectProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategorySelect = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategorySelectProps) => {
  const t = useTranslations("ProjectPage");

  return (
    <Select
      dir={t("language").toLowerCase() === "en" ? "rtl" : "ltr"}
      value={selectedCategory}
      onValueChange={onCategoryChange}
    >
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder={t("SelectCategory")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("SelectCategory")}</SelectLabel>
          {["All", ...categories].map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
