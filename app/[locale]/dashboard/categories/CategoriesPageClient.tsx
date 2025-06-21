"use client";

import React, { useState } from "react";
import { categoriesColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddCategoryForm from "@/components/form/AddCategoryForm";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import EditCategoryForm from "@/components/form/EditCategoryForm";
import { Category } from "@/types/dashboard.types";
import { deleteCategory } from "@/lib/actions/dashboard.actions";

const CategoriesPageClient = ({ categories }: { categories: Category[] }) => {
  const [categoriesData, setCategoriesData] = useState(categories);
  const [openCategory, setOpenCategory] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const handleDelete = async (categoryId: string) => {
    const confirm = window.confirm("هل أنت متأكد من حذف هذا العنصر؟");
    if (confirm) {
      try {
        await deleteCategory(categoryId);
        setCategoriesData((prev) =>
          prev.filter((item) => item.id !== categoryId)
        );
        alert("تم الحذف بنجاح!");
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("حدث خطأ أثناء الحذف.");
      }
    }
  };

  const handleAdd = (newCategory: Category) => {
    setCategoriesData((prev) => [...prev, newCategory]);
  };

  const handleEdit = (updatedCategory: Category) => {
    setCategoriesData((prev) =>
      prev.map((item) =>
        item.id === updatedCategory.id ? updatedCategory : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      <Button
        onClick={() => setOpenCategory(true)}
        className="mb-4 bg-slate-600 hover:bg-slate-700 text-white"
      >
        إضافة فئة
        <FaPlus />
      </Button>

      <Dialog open={openCategory} onOpenChange={setOpenCategory}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl font-extrabold">
              إضافة فئة
            </DialogTitle>
          </DialogHeader>
          <AddCategoryForm setOpen={setOpenCategory} onAdd={handleAdd} />
        </DialogContent>
      </Dialog>

      {editCategory && (
        <Dialog
          open={Boolean(editCategory)}
          onOpenChange={() => setEditCategory(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-xl font-extrabold">
                تعديل فئة
              </DialogTitle>
            </DialogHeader>
            <EditCategoryForm
              category={editCategory}
              setOpen={() => setEditCategory(null)}
              onEdit={handleEdit}
            />
          </DialogContent>
        </Dialog>
      )}

      <DataTable
        page="categories"
        columns={categoriesColumns.map((column) => {
          if (column.id === "actions") {
            return {
              ...column,
              cell: ({ row }) => {
                const rowData = row.original;
                return (
                  <div className="flex justify-center items-center gap-1">
                    {/* زر الحذف */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(rowData.id)}
                    >
                      <MdDelete color="red" className="!w-6 !h-6" />
                    </Button>
                    {/* زر التعديل */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditCategory(rowData)}
                    >
                      <FaEdit color="gray" className="!w-6 !h-6" />
                    </Button>
                  </div>
                );
              },
            };
          }
          return column;
        })}
        data={categoriesData}
      />
    </div>
  );
};

export default CategoriesPageClient;
