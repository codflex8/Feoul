"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "react-phone-number-input/style.css";
import { HexColorPicker } from "react-colorful";
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
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { addCategory, getCategories } from "@/lib/actions/dashboard.actions";

const formSchema = z.object({
  name: z
    .string({
      required_error: "اسم الفئة مطلوب",
    })
    .min(2, {
      message: "اسم الفئة يجب ألا يقل عن حرفين",
    }),
  color: z.string({
    required_error: "لون الفئة مطلوب",
  }),
  status: z.enum(["published", "draft", "deleted"], {
    required_error: "حالة الفئة مطلوبة",
  }),
});

const AddCategoryForm = ({ setOpen, onAdd }: React.ComponentState) => {
  const t = useTranslations("BuildingViewPage");
  const [color, setColor] = useState("#aabbcc");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#ff0000",
      status: "published",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Category Data to be sent:", values);
    try {
      const category = await addCategory(values);
      onAdd(category);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
                إسم الفئة
              </FormLabel>
              <FormControl>
                <Input placeholder="نموذج A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={() => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
                لون الفئة
              </FormLabel>
              <FormControl>
                <HexColorPicker
                  className="!h-[120px]"
                  color={color}
                  onChange={setColor}
                />
              </FormControl>
              <p className="text-sm font-semibold flex items-center gap-6">
                اللون المختار هو
                <span
                  className="inline-block w-14 h-6 rounded-sm"
                  style={{ backgroundColor: color }}
                ></span>
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
                حالة الفئة
              </FormLabel>
              <Select
                dir="rtl"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="منشورة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="shad-select-content">
                  {["published", "draft", "deleted"].map((dir, i) => (
                    <SelectItem key={dir + i} value={dir}>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <p>{dir}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="block w-full  transition-all bg-green-600 hover:bg-green-500 text-lg h-fit"
          type="submit"
        >
          إضافة
        </Button>
      </form>
    </Form>
  );
};

export default AddCategoryForm;
