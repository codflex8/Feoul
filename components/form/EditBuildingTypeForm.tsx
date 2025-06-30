"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FileUploader from "@/components/dashboard/fileUploader";
import { BuildingType } from "@/types/dashboard.types";
import { editBuildingType as editBuildingTypeAPI } from "@/lib/actions/dashboard.actions";

const formSchema = z.object({
  name: z.string().min(1, "اسم النوع يجب ألا يقل عن حرف"),
  buildingImage: z.instanceof(File).array().optional(),
  apartmentImages: z.instanceof(File).array().optional(),
  video: z.instanceof(File).array().optional(),
});

interface EditBuildingTypeFormProps {
  buildingType: BuildingType;
  setOpen: () => void;
  onEdit: (buildingType: BuildingType) => void;
}

const EditBuildingTypeForm = ({ buildingType, setOpen, onEdit }: EditBuildingTypeFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: buildingType.name,
      buildingImage: [],
      apartmentImages: [],
      video: [],
    },
  });

  
const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    const formData = new FormData();
    formData.append("name", values.name);

    if (values.buildingImage?.[0]) {
      formData.append("buildingImage", values.buildingImage[0]);
    }

    if (values.apartmentImages?.length) {
      values.apartmentImages.forEach((file) => {
        formData.append("apartmentImages", file);
      });
    }

    if (values.video?.[0]) {
      formData.append("video", values.video[0]);
    }

    const updatedFromServer = await editBuildingTypeAPI(buildingType.id, formData);

    onEdit(updatedFromServer);  
    setOpen();  
  } catch (error) {
    console.error("Failed to update building type:", error);
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
              <FormLabel className="font-semibold text-base">
                اسم نوع العمارة
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4">
          <div>
            <p className="font-semibold text-base mb-2">صورة العمارة الحالية</p>
            <img 
              src={buildingType.buildingImage} 
              alt="Current building" 
              className="w-32 h-32 object-cover rounded"
            />
          </div>
          
          <FormField
            control={form.control}
            name="buildingImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  تحديث صورة العمارة
                </FormLabel>
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

        <div className="grid gap-4">
          <div>
            <p className="font-semibold text-base mb-2">صور الشقق الحالية</p>
            <div className="flex gap-2">
              {buildingType.apartmentImages.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`Apartment ${index + 1}`} 
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="apartmentImages"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  تحديث صور الشقق
                </FormLabel>
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

        <FormField
          control={form.control}
          name="video"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
                تحديث الفيديو (اختياري)
              </FormLabel>
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

        <Button
          className="w-full bg-blue-600 hover:bg-blue-500"
          type="submit"
        >
          تحديث نوع العمارة
        </Button>
      </form>
    </Form>
  );
};

export default EditBuildingTypeForm;