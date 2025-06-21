"use client"

import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useTranslations } from "next-intl"
import Image from "next/image"
import clsx from "clsx"
import { Switch } from "./ui/switch"

export function HelppingTools() {
  const t = useTranslations("ProjectPage")
  const [isOpen, setIsOpen] = useState(false)
  const [tools, setTools] = useState<string[]>([])

  const handleShowAllBtn = () => {
    setTools((prev: string[]) => (
      prev.includes("library") &&
        prev.includes("educate") &&
        prev.includes("hospital") &&
        prev.includes("commerical") &&
        prev.includes("kindergarten") &&
        prev.includes("mosque") ? [] : ["library", "educate", "hospital", "commerical", "kindergarten", "mosque"]
    ))
  }
  const isAll = tools.includes("library") &&
    tools.includes("educate") &&
    tools.includes("hospital") &&
    tools.includes("commerical") &&
    tools.includes("kindergarten") &&
    tools.includes("mosque")

  const toggleTool = (type: string) => {
    setTools((prev: string[]) =>
      prev.includes(type) ? prev.filter((t: string) => t !== type) : [...prev, type]
    );
  };

  const helpingTools = ["library", "educate", "hospital", "commerical", "kindergarten", "mosque"]

  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={clsx("absolute bottom-2", t("language").toLowerCase() === "en" ? "left-2 md:left-14" : "right-2 md:right-14")}
    >
      <div className="flex items-center justify-end">
        <CollapsibleTrigger asChild>
          <Button size="sm" className={clsx("transition-[bg] duration-700 ease-in-out", isOpen ? "bg-white text-black hover:bg-white" : '')}>
            <ChevronsUpDown className="h-4 w-4" />
            <span className="">{t("HelpingTools")}</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div
        className={clsx(
          "overflow-hidden transition-[height] duration-300 ease-in-out",
          isOpen ? "h-[60px]" : "h-0"
        )}
      >
        <CollapsibleContent className="flex items-center justify-between gap-2 space-y-2 transform transition-[display] duration-300 ease-in-out w-full overflow-x-scroll ">
          {helpingTools.map((item, key) => (
            <Button key={key} size="sm" onClick={() => toggleTool(item)} className={clsx("flex flex-col gap-1 h-fit mt-2 py-1 px-4 text-sm", tools.includes(item) ? "bg-white text-black hover:bg-white" : '')} >
              <Image
                src={`/assets/icons/${item}-logo.svg`}
                alt={item}
                width={18}
                height={18}
              />
              <span className="text-sm">{t(item.charAt(0).toUpperCase() + item.slice(1))}</span>
            </Button>
          ))}

          <div onClick={handleShowAllBtn} className={clsx("flex items-center justify-center whitespace-nowrap cursor-pointer rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 flex-col gap-1 py-1 px-3", isAll ? "bg-white !text-black hover:bg-white" : '')} >
            <Switch dir="ltr" checked={isAll} onCheckedChange={handleShowAllBtn} onClick={handleShowAllBtn} />
            <span className="text-sm">{t("ShowAll")}</span>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

export default HelppingTools;