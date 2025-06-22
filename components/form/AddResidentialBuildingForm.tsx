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

const imageUrl = "/assets/images/project.jpg";
const imageBounds: L.LatLngBoundsExpression = [
  [0, 0],
  [450, 800],
];

const formSchema = z.object({
  name: z.string().min(2, "اسم العمارة يجب ألا يقل عن حرفين"),
  projectId: z.string().min(1, "المشروع مطلوب"),
  buildingTypeId: z.string().min(1, "نوع العمارة مطلوب"),
  image: z.instanceof(File).array().min(1, "صورة العمارة مطلوبة"),
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
  const [position, setPosition] = useState({ lat: 0.0, lng: 0.0 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      projectId: "",
      buildingTypeId: "",
      image: [],
      position_x: 0,
      position_y: 0,
      status: "متاح",
    },
  });

  useEffect(() => {
    // هنا سيتم جلب المشاريع من نوع "عمارات سكنية" وأنواع العمارات
    // مؤقتاً سنستخدم بيانات وهمية
    setProjects([
      { id: "1", name: "مشروع العمارات الحديثة", type: "عمارات سكنية" } as Project,
      { id: "2", name: "مشروع الأبراج السكنية", type: "عمارات سكنية" } as Project,
    ]);
    
    setBuildingTypes([
      { id: "1", name: "نوع A" } as BuildingType,
      { id: "2", name: "نوع B" } as BuildingType,
      { id: "3", name: "نوع C" } as BuildingType,
      { id: "4", name: "نوع D" } as BuildingType,
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
      const selectedProject = projects.find(p => p.id === values.projectId);
      const selectedBuildingType = buildingTypes.find(bt => bt.id === values.buildingTypeId);

      const newBuilding: ResidentialBuilding = {
        id: Date.now().toString(),
        name: values.name,
        projectId: values.projectId,
        buildingTypeId: values.buildingTypeId,
        project: selectedProject!,
        buildingType: selectedBuildingType!,
        image: URL.createObjectURL(values.image[0]),
        position_x: values.position_x,
        position_y: values.position_y,
        status: values.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onAdd(newBuilding);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add residential building:", error);
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
              <FormLabel>اسم العمارة السكنية</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>صورة العمارة</FormLabel>
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

        <FormLabel>تحديد الموقع على الخريطة</FormLabel>
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
          إضافة العمارة السكنية
        </Button>
      </form>
    </Form>
  );
};

export default AddResidentialBuildingForm;