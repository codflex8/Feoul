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
import {
  getResidentialBuildings,
  addApartment,
} from "@/lib/actions/dashboard.actions";

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
  const [mapImageUrl, setMapImageUrl] = useState("");
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
    const fetchBuildings = async () => {
      try {
        const data = await getResidentialBuildings();
        setBuildings(data);
      } catch (error) {
        console.error("فشل في جلب بيانات العمارات:", error);
      }
    };

    fetchBuildings();
  }, []);

  useEffect(() => {
    const selectedBuilding = buildings.find(
      (b) => b.id === form.watch("buildingId")
    );
    if (selectedBuilding?.buildingType?.buildingImage) {
      setMapImageUrl(
        `http://13.59.197.112${selectedBuilding.buildingType.buildingImage}`
      );
    } else {
      setMapImageUrl("");
    }
  }, [form.watch("buildingId"), buildings]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        form.setValue("position_x", e.latlng.lat);
        form.setValue("position_y", e.latlng.lng);
      },
    });
    return <Marker position={position} />;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const selectedBuilding = buildings.find(
        (b) => b.id === values.buildingId
      );

      const apartmentPayload = {
        number: parseInt(values.number),
        name: values.name || `شقة ${values.number}`,
        size: values.buildSpace,
        price: values.price,
        status:
          values.status === "متاح"
            ? "avaliable"
            : values.status === "مباع"
            ? "sold"
            : "reserved",
        landSpace: values.landSpace,
        buildSpace: values.buildSpace,
        bedroomNumber: values.bedroomNumber,
        bathroomNumber: values.bathroomNumber,
        lat: values.position_x.toString(),
        lng: values.position_y.toString(),
        buildingId: values.buildingId,
      };

      const created = await addApartment(apartmentPayload);

      console.log("Apartment added successfully:", created);
      onAdd(created); 
      setOpen(false);
    } catch (error) {
      console.error("فشل في إضافة الشقة:", error);
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
                      عمارة رقم {building.number} -{" "}
                      {building.project?.name ?? "بدون مشروع"}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
          <ImageOverlay url={mapImageUrl} bounds={imageBounds} />
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
