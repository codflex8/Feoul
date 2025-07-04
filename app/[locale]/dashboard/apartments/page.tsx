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
import { Apartment } from "@/types/dashboard.types";
import AddApartmentForm from "@/components/form/AddApartmentForm";
import EditApartmentForm from "@/components/form/EditApartmentForm";
import ExcelImportDialog from "@/components/dashboard/ExcelImportDialog";
import { getApartments, deleteApartment, importApartmentsFromExcel } from "@/lib/actions/dashboard.actions";

const ApartmentsPage = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [editApartment, setEditApartment] = useState<Apartment | null>(null);
  const [openImportDialog, setOpenImportDialog] = useState<boolean>(false);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await getApartments();
        setApartments(data.items || []);
      } catch (error) {
        console.error("Failed to fetch apartments:", error);
      }
    };
    fetchApartments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الشقة؟")) return;

    try {
      await deleteApartment(id);
      setApartments((prev) => prev.filter((apt) => apt.id !== id));
    } catch (error) {
      alert("حدث خطأ أثناء حذف الشقة");
      console.error(error);
    }
  };

  const handleAdd = (newApartment: Apartment) => {
    setApartments((prev) => [...prev, newApartment]);
  };

  const handleEdit = (updatedApartment: Apartment) => {
    setApartments((prev) =>
      prev.map((item) => (item.id === updatedApartment.id ? updatedApartment : item))
    );
  };

  const handleImportSuccess = (importedData: Apartment[]) => {
    setApartments((prev) => [...prev, ...importedData]);
    setOpenImportDialog(false);
  };

const apartmentsColumns: ColumnDef<Apartment>[] = [
  {
    accessorKey: "number",
    header: () => <div className="text-center font-semibold">رقم الشقة</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium text-sm">{row.getValue("number")}</p>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center font-semibold">نوع الشقة</div>,
    cell: ({ row }) => {
      const apartmentType = row.getValue("type") as { name: string; price: number };
      return (
        <div className="text-center">
          <p className="font-medium text-sm">{apartmentType?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "index",
    header: () => <div className="text-center font-semibold">رقم الدور</div>,
    cell: ({row}) => <p className="text-center font-medium text-sm">{row.getValue("index")}</p>,  
  },
  {
    accessorKey: "building",
    header: () => <div className="text-center font-semibold">العمارة</div>,
    cell: ({ row }) => {
      const building = row.getValue("building") as { number?: string | number };
      return <p className="text-center font-medium text-sm"> {building?.number || "-"}</p>;
    },
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center font-semibold">غرف النوم</div>,
    cell: ({ row }) => {
      const apartmentType = row.getValue("type") as { bedroomsNumber: number };
      return (
        <p className="text-center font-medium text-sm">{apartmentType?.bedroomsNumber}</p>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center font-semibold">دورات المياه</div>,
    cell: ({ row }) => {
      const apartmentType = row.getValue("type") as { bathroomsNumber: number };
      return (
        <p className="text-center font-medium text-sm">{apartmentType?.bathroomsNumber}</p>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center font-semibold">المساحة الصافية</div>,
    cell: ({ row }) => {
      const apartmentType = row.getValue("type") as { area: number };
      return (
        <p className="text-center font-medium text-sm">{apartmentType?.area} م²</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center font-semibold">الحالة</div>,
    cell: ({ row }) => {
      // تحويل الحالة من الانجليزي للعربي
      const statusMap: Record<string, string> = {
        "avaliable": "متاح",
        "reserved": "محجوز",
        "sold": "مباع",
      };
      const status = row.getValue("status") as string;
      const statusText = statusMap[status.toLowerCase()] || status;

      return (
        <div className="flex justify-center">
          <span
            className={`flex w-fit items-center gap-2 rounded-full px-4 py-1 ${
              statusText === "متاح"
                ? "bg-green-200 text-green-800"
                : statusText === "محجوز"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {statusText}
          </span>
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
        >
          <MdDelete color="red" className="!w-6 !h-6" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setEditApartment(row.original)}
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
        <h1 className="text-2xl font-semibold text-gray-800">الشقق السكنية</h1>
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
            إضافة شقة سكنية <FaPlus />
          </Button>
        </div>
      </div>

      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">
              إضافة شقة سكنية
            </DialogTitle>
          </DialogHeader>
          <AddApartmentForm setOpen={setOpenAddDialog} onAdd={handleAdd} />
        </DialogContent>
      </Dialog>

      {editApartment && (
        <Dialog
          open={Boolean(editApartment)}
          onOpenChange={() => setEditApartment(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold">
                تعديل شقة سكنية
              </DialogTitle>
            </DialogHeader>
            <EditApartmentForm
              apartment={editApartment}
              setOpen={() => setEditApartment(null)}
              onEdit={handleEdit}
            />
          </DialogContent>
        </Dialog>
      )}

      <ExcelImportDialog
        isOpen={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        onImportSuccess={handleImportSuccess}
        importType="apartments"
        title="استيراد الشقق السكنية من Excel"
       templateColumns={[
  "Apartment Number",
  "Apartment Type ID",
  "Floor Number",
  "Residential Building ID",
  "Latitude (lat)",
  "Longitude (lng)",
  "Status (Available / Reserved / Sold)"
]}

      />

      <DataTable columns={apartmentsColumns} data={apartments} />
    </div>
  );
};

export default ApartmentsPage;