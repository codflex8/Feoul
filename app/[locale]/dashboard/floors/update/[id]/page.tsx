"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FileUploader from "@/components/dashboard/fileUploader";
import { toast } from "@/hooks/use-toast";
import {
  updateFloor,
  getUnits,
  getFloorById,
} from "@/lib/actions/dashboard.actions";
import { useParams } from "next/navigation";

const buildFormSchema = z.object({
  name: z.string().min(2, "إسم الطابق يجب ألا يقل عن 2 أحرف"),
  index: z.number().min(0, "ترتيب الطابق مطلوب"),
  image: z
    .array(z.instanceof(File).optional())
    .refine((files) => files?.length <= 1, {
      message: "يجب أن يكون هناك ملف صورة واحد فقط",
    })
    .optional(),
  unitId: z.string().min(1, "رقم الوحدة مطلوب"),
});

const UpdateUnitFloorForm = () => {
  const [units, setUnits] = useState([]);
  const { id: floorId } = useParams();
  const [existingFloor, setExistingFloor] = useState<any>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      const unitsData = await getUnits();
      setUnits(unitsData?.items || []);
    };
    fetchUnits();
  }, []);

  useEffect(() => {
    const fetchFloorData = async () => {
      const floorData = await getFloorById(floorId);
      setExistingFloor(floorData);
    };
    if (floorId) {
      fetchFloorData();
    }
  }, [floorId]);

  const form = useForm({
    resolver: zodResolver(buildFormSchema),
    defaultValues: {
      name: existingFloor?.name || "",
      index: existingFloor?.index || 0,
      image: existingFloor?.image ? [existingFloor?.image] : [],
      unitId: existingFloor?.unit?.id || "",
    },
  });

  useEffect(() => {
    if (existingFloor) {
      form.reset({
        name: existingFloor?.name || "",
        index: existingFloor?.index || 0,
        image: existingFloor?.image ? [existingFloor?.image] : [],
        unitId: existingFloor?.unit?.id || "",
      });
    }
  }, [existingFloor, form]);

  const onSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("index", values.index);
    formData.append("unitId", values.unitId);

    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }

    try {
      console.log("📡 Sending request to updateUnitFloor...");
      const response = await updateFloor(floorId, formData);
      console.log("✅ updateFloor response:", response);

      toast({
        title: "نجاح",
        description: "تم تحديث الطابق بنجاح!",
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Error in updateUnitFloor:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الطابق",
        variant: "destructive",
      });
    }
  };

  if (!existingFloor) {
    return <div>تحميل البيانات...</div>;
  }

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الطابق</FormLabel>
                <FormControl>
                  <Input {...field} defaultValue={existingFloor?.name} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ترتيب الطابق</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    defaultValue={existingFloor?.index}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اختر الوحدة</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={existingFloor?.unit?.id}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر وحدة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units?.map((unit) => (
                      <SelectItem key={unit?.id} value={unit?.id}>
                        {unit?.name}
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
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  صورة الطابق
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col">
                    {/* Display the existing image if imageUrl exists */}
                    {existingFloor?.imageUrl && (
                      <div className="mb-2">
                        <img
                          src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}${existingFloor.imageUrl}`}
                          alt="Current Floor Image"
                          className="max-w-[200px] mb-2"
                        />
                      </div>
                    )}

                    {/* File uploader */}
                    <FileUploader
                      files={field.value ?? []}
                      onChange={(files) => {
                        // If new files are selected, remove the old image and set the new one
                        if (files?.length > 0) {
                          field.onChange(files); // Set the new file in the form field
                          existingFloor.imageUrl = null; // Remove old image URL
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">تحديث الطابق</Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateUnitFloorForm;
