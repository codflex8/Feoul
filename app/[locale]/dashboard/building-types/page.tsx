"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { DataTable } from "@/components/table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { BuildingType } from "@/types/dashboard.types";
import AddBuildingTypeForm from "@/components/form/AddBuildingTypeForm";
import EditBuildingTypeForm from "@/components/form/EditBuildingTypeForm";

const buildingTypesColumns: ColumnDef<BuildingType>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center font-semibold">اسم النوع</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "buildingImage",
    header: () => <div className="text-center font-semibold">صورة العمارة</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <img
          src={row.getValue("buildingImage")}
          alt="Building"
          className="w-16 h-16 object-cover rounded"
        />
      </div>
    ),
  },
  {
    accessorKey: "apartmentImages",
    header: () => <div className="text-center font-semibold">صور الشقق</div>,
    cell: ({ row }) => {
      const images = row.getValue("apartmentImages") as string[];
      return (
        <div className="flex justify-center gap-1">
          {images.slice(0, 3).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Apartment ${index + 1}`}
              className="w-8 h-8 object-cover rounded"
            />
          ))}
          {images.length > 3 && (
            <span className="text-xs text-gray-500">+{images.length - 3}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "video",
    header: () => <div className="text-center font-semibold">فيديو</div>,
    cell: ({ row }) => {
      const video = row.getValue("video") as string;
      return (
        <div className="text-center">
          {video ? (
            <span className="text-green-600">متوفر</span>
          ) : (
            <span className="text-gray-400">غير متوفر</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">الإجراءات</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center gap-1">
        <Button size="icon" variant="ghost">
          <MdDelete color="red" className="!w-6 !h-6" />
        </Button>
        <Button size="icon" variant="ghost">
          <FaEdit color="gray" className="!w-6 !h-6" />
        </Button>
      </div>
    ),
  },
];

const BuildingTypesPage = () => {
  const [buildingTypes, setBuildingTypes] = useState<BuildingType[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [editBuildingType, setEditBuildingType] = useState<BuildingType | null>(null);

  const handleAdd = (newBuildingType: BuildingType) => {
    setBuildingTypes((prev) => [...prev, newBuildingType]);
  };

  const handleEdit = (updatedBuildingType: BuildingType) => {
    setBuildingTypes((prev) =>
      prev.map((item) =>
        item.id === updatedBuildingType.id ? updatedBuildingType : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          أنواع العمارات السكنية
        </h1>
        <Button
          onClick={() => setOpenAddDialog(true)}
          className="bg-slate-600 hover:bg-slate-700 text-white"
        >
          إضافة نوع عمارة
          <FaPlus />
        </Button>
      </div>

      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">
              إضافة نوع عمارة سكنية
            </DialogTitle>
          </DialogHeader>
          <AddBuildingTypeForm setOpen={setOpenAddDialog} onAdd={handleAdd} />
        </DialogContent>
      </Dialog>

      {editBuildingType && (
        <Dialog
          open={Boolean(editBuildingType)}
          onOpenChange={() => setEditBuildingType(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold">
                تعديل نوع عمارة سكنية
              </DialogTitle>
            </DialogHeader>
            <EditBuildingTypeForm
              buildingType={editBuildingType}
              setOpen={() => setEditBuildingType(null)}
              onEdit={handleEdit}
            />
          </DialogContent>
        </Dialog>
      )}

      <DataTable columns={buildingTypesColumns} data={buildingTypes} />
    </div>
  );
};

export default BuildingTypesPage;