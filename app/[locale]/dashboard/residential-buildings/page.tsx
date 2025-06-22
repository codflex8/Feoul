"use client";

import React, { useState, useEffect } from "react";
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
import { ResidentialBuilding } from "@/types/dashboard.types";
import AddResidentialBuildingForm from "@/components/form/AddResidentialBuildingForm";
import EditResidentialBuildingForm from "@/components/form/EditResidentialBuildingForm";

const residentialBuildingsColumns: ColumnDef<ResidentialBuilding>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center font-semibold">اسم العمارة</div>,
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
    accessorKey: "buildingType",
    header: () => <div className="text-center font-semibold">نوع العمارة</div>,
    cell: ({ row }) => {
      const buildingType = row.getValue("buildingType") as { name: string };
      return <p className="text-center font-medium text-sm">{buildingType.name}</p>;
    },
  },
  {
    accessorKey: "image",
    header: () => <div className="text-center font-semibold">صورة العمارة</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <img
          src={row.getValue("image")}
          alt="Building"
          className="w-16 h-16 object-cover rounded"
        />
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center font-semibold">الحالة</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span
          className={`flex w-fit items-center gap-2 rounded-full px-4 py-1 ${
            row.getValue("status") === "متاح"
              ? "bg-green-200 text-green-800"
              : row.getValue("status") === "محجوز"
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

const ResidentialBuildingsPage = () => {
  const [buildings, setBuildings] = useState<ResidentialBuilding[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [editBuilding, setEditBuilding] = useState<ResidentialBuilding | null>(null);

  const handleAdd = (newBuilding: ResidentialBuilding) => {
    setBuildings((prev) => [...prev, newBuilding]);
  };

  const handleEdit = (updatedBuilding: ResidentialBuilding) => {
    setBuildings((prev) =>
      prev.map((item) =>
        item.id === updatedBuilding.id ? updatedBuilding : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          العمارات السكنية
        </h1>
        <Button
          onClick={() => setOpenAddDialog(true)}
          className="bg-slate-600 hover:bg-slate-700 text-white"
        >
          إضافة عمارة سكنية
          <FaPlus />
        </Button>
      </div>

      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">
              إضافة عمارة سكنية
            </DialogTitle>
          </DialogHeader>
          <AddResidentialBuildingForm setOpen={setOpenAddDialog} onAdd={handleAdd} />
        </DialogContent>
      </Dialog>

      {editBuilding && (
        <Dialog
          open={Boolean(editBuilding)}
          onOpenChange={() => setEditBuilding(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold">
                تعديل عمارة سكنية
              </DialogTitle>
            </DialogHeader>
            <EditResidentialBuildingForm
              building={editBuilding}
              setOpen={() => setEditBuilding(null)}
              onEdit={handleEdit}
            />
          </DialogContent>
        </Dialog>
      )}

      <DataTable columns={residentialBuildingsColumns} data={buildings} />
    </div>
  );
};

export default ResidentialBuildingsPage;