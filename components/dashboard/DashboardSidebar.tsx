"use client";

import Link from "next/link";
import { MdCategory, MdInterests } from "react-icons/md";
import {
  FaBuilding,
  FaBuildingCircleCheck,
  FaBuildingLock,
  FaMoneyBillTransfer,
  FaLayerGroup,
  FaChrome,
  FaHome,
} from "react-icons/fa6";
import { BiSolidDashboard } from "react-icons/bi";
import { FaCity } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface ItemsProps {
  title: string;
  url: string;
  icon: React.ElementType;
}

const items: ItemsProps[] = [
  {
    title: "لوحة التحكم",
    url: "/ar/dashboard",
    icon: BiSolidDashboard,
  },
  {
    title: "المشاريع",
    url: "/ar/dashboard/projects",
    icon: FaCity,
  },
  {
    title: "الفئات",
    url: "/ar/dashboard/categories",
    icon: MdCategory,
  },
  {
    title: "أنواع العمارات السكنية",
    url: "/ar/dashboard/building-types",
    icon: FaChrome,
  },
  {
    title: "العمارات السكنية",
    url: "/ar/dashboard/residential-buildings",
    icon: FaBuilding,
  },
  {
    title: "أنواع الشقق السكنية",
    url: "/ar/dashboard/apartment-types",
    icon: FaChrome,
  },
  {
    title: "الشقق السكنية",
    url: "/ar/dashboard/apartments",
    icon: FaChrome,
  },
  {
    title: "الطوابق السكنية",
    url: "/ar/dashboard/floors",
    icon: FaLayerGroup,
  },
  {
    title: "الإهتمامات",
    url: "/ar/dashboard/interests",
    icon: MdInterests,
  },
  {
    title: "الوحدات السكنية",
    url: "/ar/dashboard/buildings",
    icon: FaBuilding,
  },
  {
    title: "الوحدات السكنية المحجوزة",
    url: "/ar/dashboard/booked-buildings",
    icon: FaBuildingLock,
  },
  {
    title: "الوحدات السكنية المباعة",
    url: "/ar/dashboard/sold-buildings",
    icon: FaBuildingCircleCheck,
  },
  {
    title: "المالية",
    url: "/ar/dashboard/financial",
    icon: FaMoneyBillTransfer,
  },
  {
    title: "طلبات التواصل",
    url: "/ar/dashboard/issues",
    icon: MdInterests,
  },
];

export default function DashboardSidebar() {
  const path = usePathname();

  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-extrabold text-black my-4">
            لوحة تحكم المسؤول
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={clsx(
                      "py-6",
                      path.split("/").pop() === item.url.split("/").pop()
                        ? "bg-[#00a8e8] hover:bg-[#00a8e8] !text-white"
                        : ""
                    )}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon className="!w-6 !h-6" />
                      <span
                        className={clsx(
                          "text-gray-600 text-base font-semibold",
                          path.split("/").pop() === item.url.split("/").pop()
                            ? "text-white"
                            : ""
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="py-6" asChild>
              <Link href="/ar/dashboard/add-project">
                <IoAdd className="!w-7 !h-7" />
                <span className="text-gray-600 text-base font-semibold">
                  إضافة مشروع
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}