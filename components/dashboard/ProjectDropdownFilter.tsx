import React, { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuRadioGroup } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { FaChevronDown } from "react-icons/fa";

interface DropdownMenuRadioProps {
  label: string;
  options: { id: string; label: string }[];
  onOptionChange: () => void;
}

export default function ProjectDropdown({ label, options }: DropdownMenuRadioProps) {
  const [selectedOption, setSelectedOption] = useState<string>(options[0]?.id || "");

  const handleOptionChange = (id: string) => {
    setSelectedOption(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[150px] flex items-center justify-between">
          <span>{options.find((option) => option.id === selectedOption)?.label || label}</span>
          <FaChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <DropdownMenuRadioGroup value={selectedOption} onValueChange={handleOptionChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.id}
              value={option.id}
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
