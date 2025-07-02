"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "../dashboard/StatusBadge";
import { Button } from "../ui/button";

import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {
  Category,
  Interest,
  Project,
  Unit,
  Operation,
  issues,
} from "@/types/dashboard.types";
import FloorDesignsPopup from "@/components/dashboard/FloorDesignsPopup";
import VideoPopup from "@/components/VideoPopup";
import ActionButtons from "./actionButton";
import FloorEdit from "@/app/[locale]/dashboard/floors/FloorEdit";
import ActionInterest from "@/app/[locale]/dashboard/interests/ActionInterest";

export const intrestsColumns: ColumnDef<Interest>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center font-semibold">معرف</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.index + 1}</p>
    ),
  },
  {
    accessorKey: "firstName",
    header: () => <div className="text-center font-semibold">الإسم الأول</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("firstName")}
      </p>
    ),
  },
  {
    accessorKey: "lastName",
    header: () => <div className="text-center font-semibold">إسم العائلة</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("lastName")}
      </p>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="text-center font-semibold">رقم الهاتف</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("phoneNumber")}
      </p>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center font-semibold">الإيميل</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("email")}</p>
    ),
  },
  {
    accessorKey: "area",
    header: () => <div className="text-center font-semibold">المنطقة</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("area")}</p>
    ),
  },
  {
    accessorKey: "unit",
    header: () => (
      <div className="text-center font-semibold">رقم الوحدة السكنية</div>
    ),
    cell: ({ row }) => {
      const unit = row.getValue("unit") as { number: string; status?: string };

      if (unit && unit.number) {
        return <p className="text-center font-medium">{unit.number}</p>;
      }

      return <p className="text-center font-medium text-gray-500">غير متوفر</p>;
    },
  },
  {
    accessorKey: "unit",
    header: () => (
      <div className="text-center font-semibold">حالة الوحدة السكنية</div>
    ),
    cell: ({ row }) => {
      const unit = row.getValue("unit") as { number: string; status?: string };

      if (unit && unit.status) {
        return <p className="text-center font-medium">{unit.status}</p>;
      }

      return <p className="text-center font-medium text-gray-500">غير متوفر</p>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">الإجراءات</div>,
    cell: ({ row }) => (
      <ActionInterest id={row?.original?.id} item={row?.original} />
    ),
  },
];
export const getProjectsColumns = (
  deleteRow: (id: string) => void,
  handleEdit: (project: Project) => void
): ColumnDef<Project>[] => [
  {
    accessorKey: "number",
    header: () => <div className="text-center font-semibold">رقم المشروع</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("number")}
      </p>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center font-semibold">اسم المشروع</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center font-semibold">نوع المشروع</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("type")}</p>
    ),
  },
  {
    accessorKey: "lat",
    header: () => (
      <div className="text-center font-semibold">نقطة خط العرض</div>
    ),
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        <span>{row.getValue("lat")}-lat</span>{" "}
      </p>
    ),
  },
  {
    accessorKey: "lng",
    header: () => (
      <div className="text-center font-semibold">نقطة خط الطول</div>
    ),
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        <span>{row.getValue("lng")}-lang</span>{" "}
      </p>
    ),
  },
  {
    accessorKey: "city",
    header: () => <div className="text-center font-semibold">المدينة</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("city")}</p>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: () => <div className="text-center font-semibold">التاريخ</div>,
    cell: ({ row }) => {
      const rawDate = row.getValue("updatedAt") as string;
      const formattedDate = new Date(rawDate).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return <p className="text-center font-medium text-sm">{formattedDate}</p>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center font-semibold">حالة المشروع</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span
          className={`flex w-fit items-center gap-2 rounded-full px-4 py-1 ${
            row.getValue("status") === "منشور"
              ? "bg-green-200 text-green-800"
              : row.getValue("status") === "مسودة"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {row.getValue("status")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">الإجراءات</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => deleteRow(row.original.id)}
        >
          <MdDelete color="red" className="!w-6 !h-6" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleEdit(row.original)}
        >
          <FaEdit color="gray" className="!w-6 !h-6" />
        </Button>
      </div>
    ),
  },
];

export const categoriesColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center font-semibold">اسم الفئة</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "color",
    header: () => <div className="text-center font-semibold">لون الفئة</div>,
    cell: ({ row }) => {
      const color = row.getValue("color") as string;
      return (
        <p
          className="text-center p-4 font-medium text-sm"
          style={{ backgroundColor: color }}
        >
          {color}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center font-semibold">حالة الفئة</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span
          className={`flex w-fit items-center gap-2 rounded-full px-4 py-1 ${
            row.getValue("status") === "منشور"
              ? "bg-green-200 text-green-800"
              : row.getValue("status") === "مسودة"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {row.getValue("status")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">الإجراءات</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center gap-1">
        <Button size="icon" variant="ghost" onClick={() => {}}>
          <MdDelete color="red" className="!w-6 !h-6" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => {}}>
          <FaEdit color="gray" className="!w-6 !h-6" />
        </Button>
      </div>
    ),
  },
];

export const unitsColumns: ColumnDef<Unit>[] = [
  {
    accessorKey: "number",
    header: () => <div className="text-center font-semibold">رقم الوحدة</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("number")}
      </p>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center font-semibold">إسم الوحدة</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "project",
    header: () => <div className="text-center font-semibold">المشروع</div>,
    cell: ({ row }) => {
      const project = row.getValue("project") as { name: string };
      return <p className="text-center font-medium text-sm">{project.name}</p>;
    },
  },
  {
    accessorKey: "template",
    header: () => <div className="text-center font-semibold">النموذج</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("template")}
      </p>
    ),
  },
  {
    accessorKey: "landSpace",
    header: () => <div className="text-center font-semibold">مساحة الأرض</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("landSpace")}
      </p>
    ),
  },
  {
    accessorKey: "buildSpace",
    header: () => <div className="text-center font-semibold">مساحة البناء</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("buildSpace")}
      </p>
    ),
  },
  {
    accessorKey: "bedroomNumber",
    header: () => <div className="text-center font-semibold">غرف النوم</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("bedroomNumber")}
      </p>
    ),
  },
  {
    accessorKey: "bathroomNumber",
    header: () => <div className="text-center font-semibold">دورات المياه</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("bathroomNumber")}
      </p>
    ),
  },
  {
    accessorKey: "floors",
    header: () => <div className="text-center font-semibold">عدد الطوابق</div>,
    cell: ({ row }) => {
      const floors = row.getValue("floors") as any[];
      return (
        <p className="text-center font-medium text-sm">
          {floors?.length || "غير متوفر"}
        </p>
      );
    },
  },
  {
    accessorKey: "floors",
    header: () => (
      <div className="text-center font-semibold">تصميم الطوابق</div>
    ),
    cell: ({ row }) => {
      const [isFloorDesignsPopupOpen, setIsFloorDesignsPopupOpen] =
        useState(false);
      const floors =
        (row.getValue("floors") as { id: string; imageUrl: string }[]) || [];

      return (
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsFloorDesignsPopupOpen(true)}
            className="text-blue-600"
          >
            عرض الطوابق
          </Button>
          <FloorDesignsPopup
            floorDesigns={floors.map((floor) => ({
              id: floor.id,
              imageUrl: floor.imageUrl,
            }))}
            isOpen={isFloorDesignsPopupOpen}
            onClose={() => setIsFloorDesignsPopupOpen(false)}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center font-semibold">السعر</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("price")}</p>
    ),
  },
  {
    accessorKey: "videoUrl",
    header: () => <div className="text-center font-semibold">فيديو الوحدة</div>,
    cell: ({ row }) => {
      const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);

      return (
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsVideoPopupOpen(true)}
            className="text-blue-600"
          >
            مشاهدة الفيديو
          </Button>
          <VideoPopup
            videoUrl={row.getValue("videoUrl")}
            isOpen={isVideoPopupOpen}
            onClose={() => setIsVideoPopupOpen(false)}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">الإجراءات</div>,
    cell: ({ row }) => {
      const unitId = row.original.id;
      return (
        <div className="flex justify-center items-center gap-1">
          <ActionButtons unitId={unitId} />
        </div>
      );
    },
  },
];

export const financialColumns: ColumnDef<Operation>[] = [
  {
    accessorKey: "number",
    header: () => <div className="text-center font-semibold">رقم</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("number")}
      </p>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center font-semibold">رقم البناية</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center font-semibold">السعر</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("price")} ريال
      </p>
    ),
  },
  {
    accessorKey: "interests",
    header: () => <div className="text-center font-semibold">اسم العميل</div>,
    cell: ({ row }) => {
      const interests = row.getValue("interests");

      if (Array.isArray(interests) && interests.length > 0) {
        const { firstName, lastName } = interests[0];
        return (
          <p className="text-center font-medium text-sm">
            {firstName} {lastName}
          </p>
        );
      }

      return <p className="text-center font-medium text-sm">غير متوفر</p>;
    },
  },
  {
    accessorKey: "interests",
    header: () => <div className="text-center font-semibold">التاريخ</div>,
    cell: ({ row }) => {
      const interests = row.getValue("interests");

      if (Array.isArray(interests) && interests.length > 0) {
        const createdAt = interests[0].createdAt;
        const formattedDate = new Date(createdAt).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return (
          <p className="text-center font-medium text-sm">{formattedDate}</p>
        );
      }

      return <p className="text-center font-medium text-sm">غير متوفر</p>;
    },
  },
  {
    accessorKey: "interests",
    header: () => <div className="text-center font-semibold">الحالة</div>,
    cell: ({ row }) => {
      const interests = row.getValue("interests");

      // تحقق من وجود بيانات في مصفوفة interests
      if (Array.isArray(interests) && interests.length > 0) {
        const status = interests[0].status; // استخراج status لأول عنصر

        return (
          <div className="flex justify-center">
            <span
              className={`flex w-fit items-center gap-2 rounded-full px-4 py-1 ${
                status === "مكتملة"
                  ? "bg-green-200 text-green-800"
                  : status === "قيد التنفيذ"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {status}
            </span>
          </div>
        );
      }

      // إذا لم تكن هناك بيانات
      return (
        <div className="flex justify-center">
          <span className="bg-gray-200 text-gray-800 flex w-fit items-center gap-2 rounded-full px-4 py-1">
            غير متوفر
          </span>
        </div>
      );
    },
  },
];
export const issuesColumns: ColumnDef<issues>[] = [
  {
    accessorKey: "rowId",
    header: () => <div className="text-center font-semibold">#</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.index + 1}</p>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center font-semibold">الاسم</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="text-center font-semibold">رقم الجوال</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("phoneNumber")}
      </p>
    ),
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center font-semibold">الرسالة</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row.getValue("description")}
      </p>
    ),
  },
];
export const floorsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "rowId",
    header: () => <div className="text-center font-semibold">رقم الطابق</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row?.original?.index}</p>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center font-semibold">الاسم</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "imageUrl",
    header: () => <div className="text-center font-semibold">الصورة</div>,
    cell: ({ row }) => (
      <center>
        <img
          src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}${row.getValue(
            "imageUrl"
          )}`}
          className="w-8 h-8"
        />
      </center>
    ),
  },
  {
    accessorKey: "category",
    header: () => <div className="text-center font-semibold">الفئة</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">
        {row?.original?.unit?.category?.name}
      </p>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">الإجراءات</div>,
    cell: ({ row }) => {
      const floorId = row.original.id;
      return (
        <div className="flex justify-center items-center gap-1">
          <div className="flex justify-center items-center gap-1">
            <FloorEdit floorId={floorId} />
          </div>
        </div>
      );
    },
  },
];