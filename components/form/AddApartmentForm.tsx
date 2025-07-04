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
  Polygon,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  getResidentialBuildings,
  getApartmentTypes,
  addApartment,
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
  polygon: z.array(z.array(z.number())).min(4, "يجب تحديد 4 نقاط على الأقل لتكوين المستطيل"),
  status: z.enum(["avaliable", "reserved", "saled"]),
});

interface AddApartmentFormProps {
  setOpen: (open: boolean) => void;
  onAdd: (apartment: Apartment) => void;
}

const AddApartmentForm = ({ setOpen, onAdd }: AddApartmentFormProps) => {
  const [buildings, setBuildings] = useState<ResidentialBuilding[]>([]);
  const [apartmentTypes, setApartmentTypes] = useState<ApartmentType[]>([]);
  const [mapImageUrl, setMapImageUrl] = useState("");
  const [polygon, setPolygon] = useState<number[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: "",
      apartmentTypeId: "",
      floorNumber: 1,
      buildingId: "",
      polygon: [],
      status: "avaliable",
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
    const selectedBuildingId = form.watch("buildingId");
    if (selectedBuildingId && buildings.length > 0) {
      const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);
      if (selectedBuilding?.buildingType?.buildingImage) {
        setMapImageUrl(`http://13.59.197.112${selectedBuilding.buildingType.buildingImage}`);
      }
    }
  }, [form.watch("buildingId"), buildings]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (isDrawing && polygon.length < 4) {
          const newPoint = [e.latlng.lat, e.latlng.lng];
          const newPolygon = [...polygon, newPoint];
          setPolygon(newPolygon);
          form.setValue("polygon", newPolygon);
          
          if (newPolygon.length === 4) {
            setIsDrawing(false);
          }
        }
      },
    });
    return null;
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setPolygon([]);
    form.setValue("polygon", []);
  };

  const clearPolygon = () => {
    setPolygon([]);
    form.setValue("polygon", []);
    setIsDrawing(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const apartmentPayload = {
        number: values.number,
        typeId: values.apartmentTypeId,
        index: values.floorNumber,
        buildingId: values.buildingId,
        polygon: values.polygon,
        status: values.status === "avaliable" ? "avaliable" : values.status === "saled" ? "sold" : "reserved",
      };

      const newApartment = await addApartment(apartmentPayload);
      onAdd(newApartment);
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
                  <Input {...field} placeholder="101" />
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
                    placeholder="1"
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
                  {["avaliable", "reserved", "saled"].map((status) => (
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

        <div className="space-y-2">
          <FormLabel>تحديد موقع الشقة على العمارة</FormLabel>
          <div className="flex gap-2 mb-2">
            <Button type="button" onClick={startDrawing} disabled={isDrawing}>
              {isDrawing ? "انقر على 4 نقاط لرسم المستطيل" : "ابدأ الرسم"}
            </Button>
            <Button type="button" onClick={clearPolygon} variant="outline">
              مسح التحديد
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            النقاط المحددة: {polygon.length}/4
          </p>
        </div>

        {mapImageUrl && (
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
            <MapClickHandler />
            
            {polygon.length >= 3 && (
              <Polygon
                positions={polygon}
                pathOptions={{
                  color: "#10B981",
                  fillColor: "#10B981",
                  fillOpacity: 0.3,
                  weight: 2,
                }}
              />
            )}
          </MapContainer>
        )}

        <Button
          className="w-full bg-green-600 hover:bg-green-500"
          type="submit"
          disabled={polygon.length < 4}
        >
          إضافة الشقة السكنية
        </Button>
      </form>
    </Form>
  );
};

export default AddApartmentForm;