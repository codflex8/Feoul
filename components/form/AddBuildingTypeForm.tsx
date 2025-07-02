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
import { addBuildingType } from "@/lib/actions/dashboard.actions";

const formSchema = z.object({
  name: z.string().min(1, "اسم النوع يجب ألا يقل عن حرف"),
  buildingImage: z.instanceof(File).array().min(1, "صورة العمارة مطلوبة"),
  video: z.instanceof(File).array().optional(),
});

interface AddBuildingTypeFormProps {
  setOpen: (open: boolean) => void;
  onAdd: (buildingType: BuildingType) => void;
}

const AddBuildingTypeForm = ({ setOpen, onAdd }: AddBuildingTypeFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      buildingImage: [],
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

      if (values.video?.[0]) {
        formData.append("video", values.video[0]);
      }

      const createdBuildingType = await addBuildingType(formData);
      onAdd(createdBuildingType);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add building type:", error);
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
                <Input placeholder="نوع A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buildingImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
                صورة العمارة السكنية
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

        <FormField
          control={form.control}
          name="video"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
                فيديو النوع (اختياري)
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
          className="w-full bg-green-600 hover:bg-green-500"
          type="submit"
        >
          إضافة نوع العمارة
        </Button>
      </form>
    </Form>
  );
};

export default AddBuildingTypeForm;
