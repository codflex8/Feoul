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
import { editApartmentType } from "@/lib/actions/dashboard.actions";

const formSchema = z.object({
  name: z.string().min(1, "اسم النموذج مطلوب"),
  price: z.number().min(1, "السعر مطلوب"),
  bedroomNumber: z.number().min(1, "عدد غرف النوم مطلوب"),
  bathroomNumber: z.number().min(1, "عدد دورات المياه مطلوب"),
  netArea: z.number().min(1, "المساحة الصافية مطلوبة"),
  images: z.instanceof(File).array().optional(),
});

interface EditApartmentTypeFormProps {
  apartmentType: ApartmentType;
  setOpen: () => void;
  onEdit: (apartmentType: ApartmentType) => void;
}

const EditApartmentTypeForm = ({ apartmentType, setOpen, onEdit }: EditApartmentTypeFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: apartmentType.name,
      price: apartmentType.price,
      bedroomNumber: apartmentType.bedroomNumber,
      bathroomNumber: apartmentType.bathroomNumber,
      netArea: apartmentType.netArea,
      images: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price.toString());
      formData.append("bedroomNumber", values.bedroomNumber.toString());
      formData.append("bathroomNumber", values.bathroomNumber.toString());
      formData.append("netArea", values.netArea.toString());

      if (values.images?.length) {
        values.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const updatedApartmentType = await editApartmentType(apartmentType.id, formData);
      onEdit(updatedApartmentType);
      setOpen();
    } catch (error) {
      console.error("Failed to update apartment type:", error);
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
                <Input {...field} />
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4">
          <div>
            <p className="font-semibold text-base mb-2">الصور الحالية</p>
            <div className="flex gap-2">
              {apartmentType.images.map((img, index) => (
                <img 
                  key={index}
                  src={`http://13.59.197.112${img}`} 
                  alt={`Image ${index + 1}`} 
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  تحديث الصور (اختياري)
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

        <Button
          className="w-full bg-blue-600 hover:bg-blue-500"
          type="submit"
        >
          تحديث نوع الشقة
        </Button>
      </form>
    </Form>
  );
};

export default EditApartmentTypeForm;