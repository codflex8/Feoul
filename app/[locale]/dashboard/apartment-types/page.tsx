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
import { ApartmentType } from "@/types/dashboard.types";
import AddApartmentTypeForm from "@/components/form/AddApartmentTypeForm";
import EditApartmentTypeForm from "@/components/form/EditApartmentTypeForm";
import ExcelImportDialog from "@/components/dashboard/ExcelImportDialog";
import {
  getApartmentTypes,
  deleteApartmentType,
  importApartmentTypesFromExcel,
} from "@/lib/actions/dashboard.actions";

const ApartmentTypesPage = () => {
  const [apartmentTypes, setApartmentTypes] = useState<ApartmentType[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [editApartmentType, setEditApartmentType] = useState<ApartmentType | null>(null);
  const [openImportDialog, setOpenImportDialog] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getApartmentTypes(page);
      setApartmentTypes(data.items || []);
      setTotalPages(data.pages || 1); // من الريسبونس
    } catch (error) {
      console.error("Failed to fetch apartment types:", error);
    }
  };

  fetchData();
}, [page]);


  const handleAdd = (newApartmentType: ApartmentType) => {
    setApartmentTypes((prev) => [...prev, newApartmentType]);
  };

  const handleEdit = (updatedApartmentType: ApartmentType) => {
    setApartmentTypes((prev) =>
      prev.map((item) =>
        item.id === updatedApartmentType.id ? updatedApartmentType : item
      )
    );
    setEditApartmentType(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا النوع؟")) return;
    try {
      await deleteApartmentType(id);
      setApartmentTypes((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete apartment type:", error);
      alert("حدث خطأ أثناء الحذف، حاول مرة أخرى.");
    }
  };

  const handleImportSuccess = (importedData: ApartmentType[]) => {
    setApartmentTypes((prev) => [...prev, ...importedData]);
    setOpenImportDialog(false);
  };

  const apartmentTypesColumns: ColumnDef<ApartmentType>[] = [
    {
      accessorKey: "name",
      header: () => <div className="text-center font-semibold">اسم النموذج</div>,
      cell: ({ row }) => (
        <p className="text-center font-medium text-sm">{row.getValue("name")}</p>
      ),
    },
    {
      accessorKey: "price",
      header: () => <div className="text-center font-semibold">السعر</div>,
      cell: ({ row }) => (
        <p className="text-center font-medium text-sm">{row.getValue("price")} ريال</p>
      ),
    },
    {
      accessorKey: "bedroomsNumber",
      header: () => <div className="text-center font-semibold">غرف النوم</div>,
      cell: ({ row }) => (
        <p className="text-center font-medium text-sm">{row.getValue("bedroomsNumber")}</p>
      ),
    },
    {
      accessorKey: "bathroomsNumber",
      header: () => <div className="text-center font-semibold">دورات المياه</div>,
      cell: ({ row }) => (
        <p className="text-center font-medium text-sm">{row.getValue("bathroomsNumber")}</p>
      ),
    },
    {
      accessorKey: "area",
      header: () => <div className="text-center font-semibold">المساحة الصافية</div>,
      cell: ({ row }) => (
        <p className="text-center font-medium text-sm">{row.getValue("area")} م²</p>
      ),
    },
    {
      accessorKey: "images",
      header: () => <div className="text-center font-semibold">صور النموذج</div>,
      cell: ({ row }) => {
        const images = (row.getValue("images") as string[]) ?? [];
        return (
          <div className="flex justify-center gap-1">
            {images.slice(0, 3).map((img, index) => (
              <img
                key={index}
                src={`http://13.59.197.112${img}`}
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
      id: "actions",
      header: () => <div className="text-center font-semibold">الإجراءات</div>,
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDelete(row.original.id)}
            aria-label="حذف النوع"
          >
            <MdDelete color="red" className="!w-6 !h-6" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setEditApartmentType(row.original)}
            aria-label="تعديل النوع"
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
        <h1 className="text-2xl font-semibold text-gray-800">أنواع الشقق السكنية</h1>
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
            إضافة نوع شقة
            <FaPlus />
          </Button>
        </div>
      </div>

      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">
              إضافة نوع شقة سكنية
            </DialogTitle>
          </DialogHeader>
          <AddApartmentTypeForm setOpen={setOpenAddDialog} onAdd={handleAdd} />
        </DialogContent>
      </Dialog>

      {editApartmentType && (
        <Dialog open={Boolean(editApartmentType)} onOpenChange={() => setEditApartmentType(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold">
                تعديل نوع شقة سكنية
              </DialogTitle>
            </DialogHeader>
            <EditApartmentTypeForm
              apartmentType={editApartmentType}
              setOpen={() => setEditApartmentType(null)}
              onEdit={handleEdit}
            />
          </DialogContent>
        </Dialog>
      )}
      <DataTable columns={apartmentTypesColumns} data={apartmentTypes} />
      <div className="flex justify-center items-center gap-4 mt-4">
  <Button
    variant="outline"
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    disabled={page === 1}
  >
    السابق
  </Button>

  <span className="text-sm text-gray-700">صفحة {page} من {totalPages}</span>

  <Button
    variant="outline"
    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={page === totalPages}
  >
    التالي
  </Button>
</div>

    </div>
  );
};

export default ApartmentTypesPage;