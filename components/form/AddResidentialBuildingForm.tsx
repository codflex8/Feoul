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
import FileUploader from "@/components/dashboard/fileUploader";
import { ResidentialBuilding, Project, BuildingType } from "@/types/dashboard.types";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// استيراد الدوال من actions
import { getBuildingProjects, getBuildingTypes, addResidentialBuilding } from "@/lib/actions/dashboard.actions";

const defaultImageBounds: L.LatLngBoundsExpression = [
  [0, 0],
  [450, 800],
];

const formSchema = z.object({
  number: z.number().min(1, "رقم العمارة مطلوب"),
  size: z.number().min(1, "حجم العمارة مطلوب"),
  projectId: z.string().min(1, "المشروع مطلوب"),
  buildingTypeId: z.string().min(1, "نوع العمارة مطلوب"),
  position_x: z.number().min(1, "موقع X مطلوب"),
  position_y: z.number().min(1, "موقع Y مطلوب"),
  status: z.enum(["متاح", "محجوز", "مباع"]),
});

interface AddResidentialBuildingFormProps {
  setOpen: (open: boolean) => void;
  onAdd: (building: ResidentialBuilding) => void;
}

const AddResidentialBuildingForm = ({ setOpen, onAdd }: AddResidentialBuildingFormProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [buildingTypes, setBuildingTypes] = useState<BuildingType[]>([]);
  const [position, setPosition] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsExpression>(defaultImageBounds);
  const [imageUrl, setImageUrl] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: 0,
      size: 0,
      projectId: "",
      buildingTypeId: "",
      position_x: 0,
      position_y: 0,
      status: "متاح",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProjects = await getBuildingProjects(); // مشاريع apartment_building فقط
        const fetchedBuildingTypes = await getBuildingTypes();

        setProjects(fetchedProjects);
        setBuildingTypes(fetchedBuildingTypes.items || fetchedBuildingTypes);
      } catch (error) {
        console.error("خطأ في تحميل المشاريع أو أنواع العمارات:", error);
      }
    };
    fetchData();
  }, []);

  // تحديث صورة الخريطة بناءً على المشروع المختار
  useEffect(() => {
    const selectedProject = projects.find(p => p.id === form.getValues("projectId"));
    if (selectedProject && selectedProject.projectDocUrl) {
      setImageUrl(`http://13.59.197.112${selectedProject.projectDocUrl}`);
      setImageBounds(defaultImageBounds);
    } else {
      setImageUrl(""); // ما تعرض شيء إذا ما في صورة
      setImageBounds(defaultImageBounds);
    }
  }, [form.watch("projectId"), projects]);

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
    const buildingData = {
      number: Number(values.number),
      size: Number(values.size),
      projectId: values.projectId,
      buildingTypeId: values.buildingTypeId,
      status: values.status,
      position_x: values.position_x,
      position_y: values.position_y,
     };

    const addedBuilding = await addResidentialBuilding(buildingData);
    onAdd(addedBuilding);
    setOpen(false);
  } catch (error) {
    console.error("فشل في إضافة العمارة:", error);
  }
};


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
       <FormField
  control={form.control}
  name="number"
  render={({ field }) => (
    <FormItem>
      <FormLabel>رقم العمارة</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          onChange={(e) => field.onChange(e.target.valueAsNumber)}
          value={field.value ?? ""}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="size"
  render={({ field }) => (
    <FormItem>
      <FormLabel>حجم العمارة (متر مربع)</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          onChange={(e) => field.onChange(e.target.valueAsNumber)}
          value={field.value ?? ""}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اختر المشروع</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مشروع" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
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
          name="buildingTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع العمارة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع العمارة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buildingTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
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
              <FormLabel>حالة العمارة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || "متاح"}>
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

        <FormLabel>تحديد الموقع على الخريطة</FormLabel>
        {imageUrl ? (
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
        ) : (
          <p className="text-center text-gray-500">الرجاء اختيار مشروع لعرض الخريطة</p>
        )}

        <Button className="w-full bg-green-600 hover:bg-green-500" type="submit">
          إضافة العمارة السكنية
        </Button>
      </form>
    </Form>
  );
};

export default AddResidentialBuildingForm;
