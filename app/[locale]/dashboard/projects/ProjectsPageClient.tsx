"use client";

import React, { useState } from 'react'
import { getProjectsColumns } from "@/components/table/columns";
import { DataTable } from '@/components/table/data-table'
import { Project } from '@/types/dashboard.types'
import { deleteProject,updateProject } from '@/lib/actions/dashboard.actions'
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
const ProjectsPageClient = ({ projects }: { projects: Project[] }) => {
  const router = useRouter();
  const [data, setData] = useState<Project[]>(projects); 

  const deleteRow = async (id: string) => {
    try {
      if (!id) {
        throw new Error("❌ Project ID is missing!");
      }
  
      console.log("🚀 Deleting project with ID:", id);
  
      // تحديث الواجهة فورًا قبل انتظار الرد
      setData((prevData) => prevData.filter((project) => project.id !== id));
  
      // استدعاء API الحذف
      await deleteProject(id);
  
      // إظهار رسالة نجاح
      toast({
        title: "✅ تم الحذف بنجاح",
        description: "تم حذف المشروع من قاعدة البيانات.",
        variant: "success",
      });
  
    } catch (error) {
      console.error("❌ Error deleting project:", error);
  
      setData((prevData) => [...prevData, { id }]); 
  
       toast({
        title: "❌ فشل الحذف",
        description: "حدث خطأ أثناء محاولة حذف المشروع.",
        variant: "destructive",
      });
    }
  };
  

 
  const updateFields: { key: keyof Project; label: string }[] = [
    { key: "name", label: "اسم المشروع" },
    { key: "location", label: "موقع المشروع" },
    { key: "city", label: "المدينة" },
  ];
  const handleEdit = (project: Project) => {
    console.log("تعديل المشروع:", project);
    router.push(`projects/update/${project.id}`); 
  };
  const columns = getProjectsColumns(deleteRow, handleEdit);

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      <DataTable
        page="projects"
        columns={columns}
        data={data}
        deleteRow={deleteRow}
        updateFields={updateFields}
      />
    </div>
  );

}

export default ProjectsPageClient
