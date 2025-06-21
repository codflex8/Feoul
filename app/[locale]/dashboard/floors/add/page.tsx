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
import { addFloor, getUnits } from "@/lib/actions/dashboard.actions";

const buildFormSchema = z.object({
  name: z.string().min(2, "إسم الطابق يجب ألا يقل عن 2 أحرف"),
  index: z.number().min(0, "ترتيب الطابق مطلوب"),
  // Allow image to be an array of files, but handle only the first file
  image: z
    .array(z.instanceof(File).optional())
    .refine((files) => files?.length <= 1, {
      message: "يجب أن يكون هناك ملف صورة واحد فقط",
    })
    .optional(),
  unitId: z.string().min(1, "رقم الوحدة مطلوب"),
});

const AddUnitFloorForm = () => {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchUnits = async () => {
      const unitsData = await getUnits();
      setUnits(unitsData?.items || []);
    };
    fetchUnits();
  }, []);

  const form = useForm({
    resolver: zodResolver(buildFormSchema),
    defaultValues: {
      name: "",
      index: 0,
      image: undefined,
      unitId: "",
    },
  });

  const onSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("index", values.index);
    formData.append("unitId", values.unitId);
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }

    try {
      console.log("📡 Sending request to addUnitFloor...");
      const response = await addFloor(formData);
      console.log("✅ add Floor response:", response);

      toast({
        title: "نجاح",
        description: "تم إضافة الطابق بنجاح!",
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Error in addUnitFloor:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الطابق",
        variant: "destructive",
      });
    }
  };

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
                  <Input {...field} />
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
                    onChange={(e) => field.onChange(Number(e.target.value))} // Convert input value to number
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
                  defaultValue={field.value}
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
              <FormItem className="">
                <FormLabel className="text-base font-semibold">
                  صورة الطابق
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

          <Button type="submit">إضافة الطابق</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddUnitFloorForm;
