"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaFileExcel, FaDownload } from "react-icons/fa6";
import { toast } from "@/hooks/use-toast";

interface ExcelImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (data: any[]) => void;
  importType: "buildingTypes" | "residentialBuildings" | "apartmentTypes" | "apartments";
  title: string;
  templateColumns: string[];
}

const ExcelImportDialog = ({
  isOpen,
  onClose,
  onImportSuccess,
  importType,
  title,
  templateColumns,
}: ExcelImportDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && 
          file.type !== "application/vnd.ms-excel") {
        toast({
          title: "خطأ",
          description: "يرجى اختيار ملف Excel صالح (.xlsx أو .xls)",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار ملف Excel أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", importType);

      // هنا ستكون دالة الاستيراد من الـ API
      const response = await fetch("/api/import-excel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("فشل في استيراد البيانات");
      }

      const result = await response.json();
      
      toast({
        title: "نجح الاستيراد",
        description: `تم استيراد ${result.importedCount} عنصر بنجاح`,
        variant: "default",
      });

      onImportSuccess(result.data);
      onClose();
      setSelectedFile(null);
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "خطأ في الاستيراد",
        description: "حدث خطأ أثناء استيراد البيانات",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    // إنشاء ملف Excel نموذجي للتحميل
    const csvContent = templateColumns.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `template_${importType}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">الأعمدة المطلوبة:</h4>
            <ul className="text-sm space-y-1">
              {templateColumns.map((column, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {column}
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="w-full"
          >
            <FaDownload className="mr-2" />
            تحميل النموذج
          </Button>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              اختر ملف Excel:
            </label>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
          </div>

          {selectedFile && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700">
                <FaFileExcel className="inline mr-1" />
                {selectedFile.name}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isUploading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isUploading ? "جاري الاستيراد..." : "استيراد البيانات"}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImportDialog;