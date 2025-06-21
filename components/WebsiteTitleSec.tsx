import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface WebsiteTitleProps {
  projectId?: string;
  projectName?: string;
  blockNumber?: number;
}

const WebsiteTitleSec = ({
  projectId,
  projectName,
  blockNumber,
}: WebsiteTitleProps) => {
  const t = useTranslations("MapPage");

  return (
    <div className="bg-slate-600 rounded-md px-4 py-1 mb-4 flex items-center gap-6 w-fit">
      <Breadcrumb>
        <BreadcrumbList className="gap-1 md:gap-2">
          <BreadcrumbItem>
            <Link href="/">
              <img src="/assets/icons/sarah-logo.png" alt="logo" width="50" height="50" />
            </Link>
          </BreadcrumbItem>
          <Badge variant="secondary">{t("JaddahCity")}</Badge>
          {projectId && (
            <>
              <BreadcrumbSeparator className="text-white font-bold rtl:rotate-180" />
              <BreadcrumbItem>
                <Badge
                  variant={projectId && !blockNumber ? "white" : "secondary"}
                >
                  <Link href={`/ar/real-estate/${projectId}`}>
                    {projectName}
                  </Link>
                </Badge>
              </BreadcrumbItem>
            </>
          )}
          {blockNumber && (
            <>
              <BreadcrumbSeparator className="text-white font-bold rtl:rotate-180" />
              <BreadcrumbItem>
                <Badge variant="white">
                  <BreadcrumbPage>
                    {t("Block")} {blockNumber}
                  </BreadcrumbPage>
                </Badge>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default WebsiteTitleSec;
