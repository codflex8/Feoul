"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus, FaFileExcel } from "react-icons/fa6";
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
import ExcelImportDialog from "@/components/dashboard/ExcelImportDialog";
import {
  getBuildingTypes,
  deleteBuildingType,
  importBuildingTypesFromExcel,
} from "@/lib/actions/dashboard.actions";

const BuildingTypesPage = () => {
  const [buildingTypes, setBuildingTypes] = useState<BuildingType[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [editBuildingType, setEditBuildingType] = useState<BuildingType | null>(null);
  const [openImportDialog, setOpenImportDialog] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTypes = await getBuildingTypes();
        console.log("🚀 ~ fetchData ~ fetchedTypes:", fetchedTypes);
        setBuildingTypes(fetchedTypes.items);
      } catch (err) {
        console.error("فشل في جلب أنواع العمارات:", err);
      }
    };

    fetchData();
  }, []);

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

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا النوع؟");
    if (!confirmDelete) return;

    try {
      await deleteBuildingType(id);
      setBuildingTypes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("فشل حذف نوع العمارة:", err);
    }
  };

  const handleImportSuccess = (importedData: BuildingType[]) => {
    setBuildingTypes((prev) => [...prev, ...importedData]);
    setOpenImportDialog(false);
  };

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
            src={`http://13.59.197.112${row.getValue("buildingImage")}`}
            alt={row.getValue("buildingImage")}
            className="w-16 h-16 object-cover rounded"
          />
        </div>
      ),
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
      cell: ({ row }) => {
        const building = row.original;
        return (
          <div className="flex justify-center items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => handleDelete(building.id)}>
              <MdDelete color="red" className="!w-6 !h-6" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setEditBuildingType(building)}>
              <FaEdit color="gray" className="!w-6 !h-6" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">أنواع العمارات السكنية</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setOpenImportDialog(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            استيراد من Excel
            <FaFileExcel />
          </Button>
          <Button
            onClick={() => setOpenAddDialog(true)}
            className="bg-slate-600 hover:bg-slate-700 text-white"
          >
            إضافة نوع عمارة
            <FaPlus />
          </Button>
        </div>
      </div>

      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">إضافة نوع عمارة سكنية</DialogTitle>
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
              <DialogTitle className="text-xl font-extrabold">تعديل نوع عمارة سكنية</DialogTitle>
            </DialogHeader>
            <EditBuildingTypeForm
              buildingType={editBuildingType}
              setOpen={() => setEditBuildingType(null)}
              onEdit={handleEdit}
            />
          </DialogContent>
        </Dialog>
      )}

      <ExcelImportDialog
        isOpen={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        onImportSuccess={handleImportSuccess}
        importType="buildingTypes"
        title="استيراد أنواع العمارات السكنية من Excel"
        templateColumns={[
          "اسم النوع",
          "صورة العمارة (رابط)",
          "فيديو (رابط اختياري)"
        ]}
      />

      <DataTable columns={buildingTypesColumns} data={buildingTypes} />
    </div>
  );
};

export default BuildingTypesPage;