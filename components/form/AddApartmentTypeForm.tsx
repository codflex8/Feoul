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
import { ApartmentType } from "@/types/dashboard.types";
import { addApartmentType } from "@/lib/actions/dashboard.actions";

const formSchema = z.object({
  name: z.string().min(1, "اسم النموذج مطلوب"),
  price: z.number().min(1, "السعر مطلوب"),
  bedroomNumber: z.number().min(1, "عدد غرف النوم مطلوب"),
  bathroomNumber: z.number().min(1, "عدد دورات المياه مطلوب"),
  netArea: z.number().min(1, "المساحة الصافية مطلوبة"),
  images: z.instanceof(File).array().min(1, "صورة واحدة على الأقل مطلوبة"),
});

interface AddApartmentTypeFormProps {
  setOpen: (open: boolean) => void;
  onAdd: (apartmentType: ApartmentType) => void;
}

const AddApartmentTypeForm = ({ setOpen, onAdd }: AddApartmentTypeFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      bedroomNumber: 1,
      bathroomNumber: 1,
      netArea: 0,
      images: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("🚀 ~ onSubmit ~ values:", values)
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price.toString());
      formData.append("bedroomsNumber", values.bedroomNumber.toString());
      formData.append("bathroomsNumber", values.bathroomNumber.toString());
      formData.append("area", values.netArea.toString());

      values.images.forEach((file) => {
          formData.append("images", file);  
        });

      const newApartmentType = await addApartmentType(formData);
      onAdd(newApartmentType);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add apartment type:", error);
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
                اسم النموذج
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="نموذج شقة A" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">السعر</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="500000"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="netArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  المساحة الصافية (م²)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="120"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bedroomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  عدد غرف النوم
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathroomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  عدد دورات المياه
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
                صور النموذج
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
          إضافة نوع الشقة
        </Button>
      </form>
    </Form>
  );
};

export default AddApartmentTypeForm;