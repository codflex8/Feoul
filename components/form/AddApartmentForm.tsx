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
import {
  MapContainer,
  ImageOverlay,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const imageUrl = "/assets/images/project.jpg";
const imageBounds: L.LatLngBoundsExpression = [
  [0, 0],
  [450, 800],
];

const formSchema = z.object({
  number: z.string().min(1, "رقم الشقة مطلوب"),
  name: z.string().min(2, "اسم الشقة يجب ألا يقل عن حرفين"),
  buildingId: z.string().min(1, "العمارة مطلوبة"),
  price: z.number().min(1, "السعر مطلوب"),
  landSpace: z.number().min(1, "مساحة الأرض مطلوبة"),
  buildSpace: z.number().min(1, "مساحة البناء مطلوبة"),
  bedroomNumber: z.number().min(1, "عدد غرف النوم مطلوب"),
  bathroomNumber: z.number().min(1, "عدد دورات المياه مطلوب"),
  position_x: z.number().min(1, "موقع X مطلوب"),
  position_y: z.number().min(1, "موقع Y مطلوب"),
  status: z.enum(["متاح", "محجوز", "مباع"]),
});

interface AddApartmentFormProps {
  setOpen: (open: boolean) => void;
  onAdd: (apartment: Apartment) => void;
}

const AddApartmentForm = ({ setOpen, onAdd }: AddApartmentFormProps) => {
  const [buildings, setBuildings] = useState<ResidentialBuilding[]>([]);
  const [position, setPosition] = useState({ lat: 0.0, lng: 0.0 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: "",
      name: "",
      buildingId: "",
      price: 0,
      landSpace: 0,
      buildSpace: 0,
      bedroomNumber: 1,
      bathroomNumber: 1,
      position_x: 0,
      position_y: 0,
      status: "متاح",
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

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        form.setValue("position_x", e.latlng.lat);
        form.setValue("position_y", e.latlng.lng);
      },
    });
    return position === null ? null : <Marker position={position} />;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const selectedBuilding = buildings.find(b => b.id === values.buildingId);

      const newApartment: Apartment = {
        id: Date.now().toString(),
        number: values.number,
        name: values.name,
        buildingId: values.buildingId,
        building: selectedBuilding!,
        price: values.price,
        landSpace: values.landSpace,
        buildSpace: values.buildSpace,
        bedroomNumber: values.bedroomNumber,
        bathroomNumber: values.bathroomNumber,
        position_x: values.position_x,
        position_y: values.position_y,
        status: values.status,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onAdd(newApartment);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add apartment:", error);
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <FormLabel>تحديد موقع الشقة على العمارة</FormLabel>
        <MapContainer
          center={[225, 400]}
          zoom={1}
          minZoom={1}
          maxZoom={4}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
          crs={L.CRS.Simple}
          maxBounds={imageBounds}
          maxBoundsViscosity={1.0}
        >
          <ImageOverlay url={imageUrl} bounds={imageBounds} />
          <LocationMarker />
        </MapContainer>

        <Button
          className="w-full bg-green-600 hover:bg-green-500"
          type="submit"
        >
          إضافة الشقة السكنية
        </Button>
      </form>
    </Form>
  );
};

export default AddApartmentForm;