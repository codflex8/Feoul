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
import { ResidentialBuilding } from "@/types/dashboard.types";
import AddResidentialBuildingForm from "@/components/form/AddResidentialBuildingForm";
import EditResidentialBuildingForm from "@/components/form/EditResidentialBuildingForm";
import ExcelImportDialog from "@/components/dashboard/ExcelImportDialog";
import {
  getResidentialBuildings,
  deleteResidentialBuilding,
  importResidentialBuildingsFromExcel,
} from "@/lib/actions/dashboard.actions";

const ResidentialBuildingsPage = () => {
  const [buildings, setBuildings] = useState<ResidentialBuilding[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [editBuilding, setEditBuilding] = useState<ResidentialBuilding | null>(null);
  const [openImportDialog, setOpenImportDialog] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getResidentialBuildings();
        setBuildings(data);
      } catch (error) {
        console.error("Failed to fetch residential buildings:", error);
      }
    };

    fetchData();
  }, []);

  const handleAdd = (newBuilding: ResidentialBuilding) => {
    setBuildings((prev) => [...prev, newBuilding]);
  };

  const handleEdit = (updatedBuilding: ResidentialBuilding) => {
    setBuildings((prev) =>
      prev.map((item) =>
        item.id === updatedBuilding.id ? updatedBuilding : item
      )
    );
    setEditBuilding(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه العمارة؟")) return;
    try {
      await deleteResidentialBuilding(id);
      setBuildings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Failed to delete building:", error);
      alert("حدث خطأ أثناء الحذف، حاول مرة أخرى.");
    }
  };

  const handleImportSuccess = (importedData: ResidentialBuilding[]) => {
    setBuildings((prev) => [...prev, ...importedData]);
    setOpenImportDialog(false);
  };

  const residentialBuildingsColumns: ColumnDef<ResidentialBuilding>[] = [
    {
      accessorKey: "number",
      header: () => <div className="text-center font-semibold">رقم العمارة</div>,
      cell: ({ row }) => (
        <p className="text-center font-medium text-sm">{row.getValue("number")}</p>
      ),
    },
    {
      accessorKey: "project",
      header: () => <div className="text-center font-semibold">المشروع</div>,
      cell: ({ row }) => {
        const project = row.getValue("project") as { name: string } | null;
        return (
          <p className="text-center font-medium text-sm">
            {project?.name ?? "غير مرتبط"}
          </p>
        );
      },
    },
    {
      accessorKey: "buildingType",
      header: () => <div className="text-center font-semibold">نوع العمارة</div>,
      cell: ({ row }) => {
        const buildingType = row.getValue("buildingType") as { name: string };
        return (
          <p className="text-center font-medium text-sm">
            {buildingType?.name ?? "غير محدد"}
          </p>
        );
      },
    },
    {
      accessorKey: "size",
      header: () => <div className="text-center font-semibold">المساحة</div>,
      cell: ({ row }) => (
        <p className="text-center font-medium text-sm">{row.getValue("size")} م²</p>
      ),
    },
    {
      accessorKey: "position",
      header: () => <div className="text-center font-semibold">الموقع</div>,
      cell: ({ row }) => {
        const position = row.getValue("position") as string[];
        return (
          <p className="text-center font-medium text-sm">
            {position?.join(" - ") || "غير معروف"}
          </p>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center font-semibold">الإجراءات</div>,
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDelete(row.original.id)}
            aria-label="حذف العمارة"
          >
            <MdDelete color="red" className="!w-6 !h-6" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setEditBuilding(row.original)}
            aria-label="تعديل العمارة"
          >
            <FaEdit color="gray" className="!w-6 !h-6" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">العمارات السكنية</h1>
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
            إضافة عمارة سكنية
            <FaPlus />
          </Button>
        </div>
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
        <Dialog open={Boolean(editBuilding)} onOpenChange={() => setEditBuilding(null)}>
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

      <ExcelImportDialog
        isOpen={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        onImportSuccess={handleImportSuccess}
        importType="residentialBuildings"
        title="استيراد العمارات السكنية من Excel"
        templateColumns={[
          "رقم العمارة",
          "المساحة",
          "معرف نوع العمارة",
          "معرف المشروع",
          "موقع X (position_x)",
          "موقع Y (position_y)"
        ]}
      />

      <DataTable columns={residentialBuildingsColumns} data={buildings} />
    </div>
  );
};

export default ResidentialBuildingsPage;