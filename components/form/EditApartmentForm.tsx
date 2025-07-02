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
import { Apartment, ResidentialBuilding, ApartmentType } from "@/types/dashboard.types";
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
  getApartmentTypes,
  updateApartment,
} from "@/lib/actions/dashboard.actions";

const imageBounds: L.LatLngBoundsExpression = [
  [0, 0],
  [450, 800],
];

const formSchema = z.object({
  number: z.string().min(1, "رقم الشقة مطلوب"),
  apartmentTypeId: z.string().min(1, "نوع الشقة مطلوب"),
  floorNumber: z.number().min(1, "رقم الدور مطلوب"),
  buildingId: z.string().min(1, "العمارة السكنية مطلوبة"),
  lat: z.number().min(-90).max(90, "خط العرض غير صالح"),
  lng: z.number().min(-180).max(180, "خط الطول غير صالح"),
  status: z.enum(["متاح", "محجوز", "مباع"]),
});

interface EditApartmentFormProps {
  apartment: Apartment;
  setOpen: (open: boolean) => void;
  onEdit: (apartment: Apartment) => void;
}

const EditApartmentForm = ({ apartment, setOpen, onEdit }: EditApartmentFormProps) => {
  const [buildings, setBuildings] = useState<ResidentialBuilding[]>([]);
  const [apartmentTypes, setApartmentTypes] = useState<ApartmentType[]>([]);
  const [mapImageUrl, setMapImageUrl] = useState("");
  const [position, setPosition] = useState({
    lat: apartment.lat || 225,
    lng: apartment.lng || 400,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: apartment.number?.toString() || "",
      apartmentTypeId: apartment.apartmentType?.id ?? "",
      floorNumber: apartment.floorNumber || 1,
      buildingId: apartment.building?.id ?? "",
      lat: apartment.lat || 225,
      lng: apartment.lng || 400,
      status: apartment.status === "avaliable" ? "متاح" : apartment.status === "reserved" ? "محجوز" : "مباع",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buildingsData, apartmentTypesData] = await Promise.all([
          getResidentialBuildings(),
          getApartmentTypes(),
        ]);
        setBuildings(buildingsData);
        setApartmentTypes(apartmentTypesData.items || []);
      } catch (error) {
        console.error("فشل في جلب البيانات:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (buildings.length > 0 && apartment.building?.id) {
      const selectedBuilding = buildings.find(b => b.id === apartment.building!.id);
      if (selectedBuilding?.buildingType?.buildingImage) {
        setMapImageUrl(`http://13.59.197.112${selectedBuilding.buildingType.buildingImage}`);
      }
    }
  }, [buildings, apartment.building]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        form.setValue("lat", e.latlng.lat);
        form.setValue("lng", e.latlng.lng);
      },
    });
    return <Marker position={position} />;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const apartmentPayload = {
        id: apartment.id,
        number: values.number,
        apartmentTypeId: values.apartmentTypeId,
        floorNumber: values.floorNumber,
        buildingId: values.buildingId,
        lat: values.lat,
        lng: values.lng,
        status: values.status === "متاح" ? "avaliable" : values.status === "مباع" ? "sold" : "reserved",
      };

      const updated = await updateApartment(apartmentPayload.id, apartmentPayload);
      onEdit(updated);
      setOpen(false);
    } catch (error) {
      console.error("فشل في تعديل الشقة:", error);
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
            name="floorNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الدور</FormLabel>
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

        <FormField
          control={form.control}
          name="apartmentTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع الشقة</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الشقة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {apartmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} - {type.bedroomNumber} غرف - {type.price} ريال
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
          name="buildingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العمارة السكنية</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العمارة السكنية" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id}>
                      عمارة رقم {building.number} - {building.project?.name ?? "بدون مشروع"}
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

        <FormLabel>تحديد موقع الشقة على العمارة</FormLabel>
        {mapImageUrl && (
          <MapContainer
            center={[position.lat, position.lng]}
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
        )}

        <Button
          className="w-full bg-green-600 hover:bg-green-500"
          type="submit"
        >
          تعديل الشقة السكنية
        </Button>
      </form>
    </Form>
  );
};

export default EditApartmentForm;