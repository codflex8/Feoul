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
import { Apartment, ResidentialBuilding } from "@/types/dashboard.types";

const formSchema = z.object({
  number: z.string().min(1, "رقم الشقة مطلوب"),
  name: z.string().min(2, "اسم الشقة يجب ألا يقل عن حرفين"),
  buildingId: z.string().min(1, "العمارة مطلوبة"),
  price: z.number().min(1, "السعر مطلوب"),
  landSpace: z.number().min(1, "مساحة الأرض مطلوبة"),
  buildSpace: z.number().min(1, "مساحة البناء مطلوبة"),
  bedroomNumber: z.number().min(1, "عدد غرف النوم مطلوب"),
  bathroomNumber: z.number().min(1, "عدد دورات المياه مطلوب"),
  status: z.enum(["متاح", "محجوز", "مباع"]),
});

interface EditApartmentFormProps {
  apartment: Apartment;
  setOpen: () => void;
  onEdit: (apartment: Apartment) => void;
}

const EditApartmentForm = ({ apartment, setOpen, onEdit }: EditApartmentFormProps) => {
  const [buildings, setBuildings] = useState<ResidentialBuilding[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: apartment.number,
      name: apartment.name,
      buildingId: apartment.buildingId,
      price: apartment.price,
      landSpace: apartment.landSpace,
      buildSpace: apartment.buildSpace,
      bedroomNumber: apartment.bedroomNumber,
      bathroomNumber: apartment.bathroomNumber,
      status: apartment.status,
    },
  });

  useEffect(() => {
    // جلب العمارات السكنية
    setBuildings([
      { 
        id: "1", 
        name: "عمارة الياسمين", 
        project: { name: "مشروع العمارات الحديثة" }
      } as ResidentialBuilding,
      { 
        id: "2", 
        name: "عمارة الورد", 
        project: { name: "مشروع الأبراج السكنية" }
      } as ResidentialBuilding,
    ]);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const selectedBuilding = buildings.find(b => b.id === values.buildingId);

      const updatedApartment: Apartment = {
        ...apartment,
        number: values.number,
        name: values.name,
        buildingId: values.buildingId,
        building: selectedBuilding!,
        price: values.price,
        landSpace: values.landSpace,
        buildSpace: values.buildSpace,
        bedroomNumber: values.bedroomNumber,
        bathroomNumber: values.bathroomNumber,
        status: values.status,
        updatedAt: new Date(),
      };

      onEdit(updatedApartment);
      setOpen();
    } catch (error) {
      console.error("Failed to update apartment:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الشقة</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الشقة</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="buildingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اختر العمارة السكنية</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر عمارة سكنية" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name} - {building.project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <FormLabel>السعر</FormLabel>
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حالة الشقة</FormLabel>
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="landSpace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>مساحة الأرض</FormLabel>
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
            name="buildSpace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>مساحة البناء</FormLabel>
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
                <FormLabel>عدد غرف النوم</FormLabel>
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
                <FormLabel>عدد دورات المياه</FormLabel>
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

        <Button
          className="w-full bg-blue-600 hover:bg-blue-500"
          type="submit"
        >
          تحديث الشقة السكنية
        </Button>
      </form>
    </Form>
  );
};

export default EditApartmentForm;