"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FileUploader from "@/components/dashboard/fileUploader";
import { ResidentialBuilding, Project, BuildingType } from "@/types/dashboard.types";

const formSchema = z.object({
  name: z.string().min(2, "اسم العمارة يجب ألا يقل عن حرفين"),
  projectId: z.string().min(1, "المشروع مطلوب"),
  buildingTypeId: z.string().min(1, "نوع العمارة مطلوب"),
  image: z.instanceof(File).array().optional(),
  status: z.enum(["متاح", "محجوز", "مباع"]),
});

interface EditResidentialBuildingFormProps {
  building: ResidentialBuilding;
  setOpen: () => void;
  onEdit: (building: ResidentialBuilding) => void;
}

const EditResidentialBuildingForm = ({ building, setOpen, onEdit }: EditResidentialBuildingFormProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [buildingTypes, setBuildingTypes] = useState<BuildingType[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: building.name,
      projectId: building.projectId,
      buildingTypeId: building.buildingTypeId,
      image: [],
      status: building.status,
    },
  });

  useEffect(() => {
    // جلب المشاريع وأنواع العمارات
    setProjects([
      { id: "1", name: "مشروع العمارات الحديثة", type: "عمارات سكنية" } as Project,
      { id: "2", name: "مشروع الأبراج السكنية", type: "عمارات سكنية" } as Project,
    ]);
    
    setBuildingTypes([
      { id: "1", name: "نوع A" } as BuildingType,
      { id: "2", name: "نوع B" } as BuildingType,
      { id: "3", name: "نوع C" } as BuildingType,
      { id: "4", name: "نوع D" } as BuildingType,
    ]);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const selectedProject = projects.find(p => p.id === values.projectId);
      const selectedBuildingType = buildingTypes.find(bt => bt.id === values.buildingTypeId);

      const updatedBuilding: ResidentialBuilding = {
        ...building,
        name: values.name,
        projectId: values.projectId,
        buildingTypeId: values.buildingTypeId,
        project: selectedProject!,
        buildingType: selectedBuildingType!,
        image: values.image?.[0] ? URL.createObjectURL(values.image[0]) : building.image,
        status: values.status,
        updatedAt: new Date(),
      };

      onEdit(updatedBuilding);
      setOpen();
    } catch (error) {
      console.error("Failed to update residential building:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم العمارة السكنية</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اختر المشروع</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مشروع" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buildingTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع العمارة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع العمارة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buildingTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>حالة العمارة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["متاح", "محجوز", "مباع"].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4">
          <div>
            <p className="font-semibold text-base mb-2">صورة العمارة الحالية</p>
            <img 
              src={building.image} 
              alt="Current building" 
              className="w-32 h-32 object-cover rounded"
            />
          </div>
          
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تحديث صورة العمارة</FormLabel>
                <FormControl>
                  <FileUploader
                    files={field.value ?? []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-500"
          type="submit"
        >
          تحديث العمارة السكنية
        </Button>
      </form>
    </Form>
  );
};

export default EditResidentialBuildingForm;