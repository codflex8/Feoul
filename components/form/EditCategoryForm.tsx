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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { updateCategory } from "@/lib/actions/dashboard.actions"; // استيراد دالة التحديث

const formSchema = z.object({
  name: z.string().min(2, { message: "اسم الفئة يجب ألا يقل عن حرفين" }),
  color: z.string(),
  status: z.enum(["published", "draft", "deleted"]),
});

const EditCategoryForm = ({
  category,
  setOpen,
  onEdit,
}: {
  category: any;
  setOpen: () => void;
  onEdit: (category: any) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      color: category.color,
      status: category.status,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(category);

      const updatedCategory = await updateCategory(category.id, values);
      onEdit(updatedCategory);
      setOpen();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1"
      >
        {/* الحقول */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الفئة</FormLabel>
              <FormControl>
                <Input placeholder="اسم الفئة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اللون</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الحالة</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="published">منشورة</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="deleted">محذوفة</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
          تعديل
        </Button>
      </form>
    </Form>
  );
};

export default EditCategoryForm;
