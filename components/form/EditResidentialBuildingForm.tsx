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
import {
  getBuildingProjects,
  getBuildingTypes,
  updateResidentialBuilding,
} from "@/lib/actions/dashboard.actions";

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
});

interface EditResidentialBuildingFormProps {
  building: ResidentialBuilding;
  setOpen: () => void;
  onEdit: (building: ResidentialBuilding) => void;
}

const EditResidentialBuildingForm = ({ building, setOpen, onEdit }: EditResidentialBuildingFormProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [buildingTypes, setBuildingTypes] = useState<BuildingType[]>([]);
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: building.position?.[0] ?? 0,
    lng: building.position?.[1] ?? 0,
  });
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsExpression>(defaultImageBounds);
  const [imageUrl, setImageUrl] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: building.number,
      size: building.size,
      projectId: building.project?.id || building.projectId,
      buildingTypeId: building.buildingType?.id || building.buildingTypeId,
      position_x: building.position?.[0] ?? 0,
      position_y: building.position?.[1] ?? 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProjects = await getBuildingProjects();
        const fetchedBuildingTypes = await getBuildingTypes();

        setProjects(fetchedProjects);
        setBuildingTypes(fetchedBuildingTypes.items || fetchedBuildingTypes);
      } catch (error) {
        console.error("خطأ في تحميل المشاريع أو الأنواع:", error);
      }
    };
    fetchData();
  }, []);

    useEffect(() => {
    const selectedProject = projects.find(p => p.id === form.watch("projectId"));
    if (selectedProject?.projectDocUrl) {
      setImageUrl(`http://13.59.197.112${selectedProject.projectDocUrl}`);
      setImageBounds(defaultImageBounds);
    } else {
      setImageUrl("");
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
  console.log("تم الضغط على الزر", values);
  try {
    const updated = await updateResidentialBuilding(building.id, {
      number: values.number,
      size: values.size,
      project: values.projectId,         // هنا تغير الاسم
      buildingType: values.buildingTypeId, // هنا تغير الاسم
      position: [values.position_x, values.position_y],
    });
    console.log(updated);
    onEdit(updated);
    setOpen();
  } catch (err) {
    console.error("فشل في التعديل:", err);
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

       
        <FormLabel>تحديد الموقع على الخريطة</FormLabel>
        {imageUrl ? (
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
            <ImageOverlay url={imageUrl} bounds={imageBounds} />
            <LocationMarker />
          </MapContainer>
        ) : (
          <p className="text-center text-gray-500">الرجاء اختيار مشروع لعرض الخريطة</p>
        )}

        <Button className="w-full bg-blue-600 hover:bg-blue-500" type="submit">
          تحديث العمارة السكنية
        </Button>
      </form>
    </Form>
  );
};

export default EditResidentialBuildingForm;