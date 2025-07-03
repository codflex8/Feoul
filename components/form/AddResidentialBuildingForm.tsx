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
import { ResidentialBuilding, BuildingType } from "@/types/dashboard.types";
import {
  MapContainer,
  ImageOverlay,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  getBuildingProjects,
  getBuildingTypes,
  addResidentialBuilding,
} from "@/lib/actions/dashboard.actions";

const imageBounds: L.LatLngBoundsExpression = [
  [0, 0],
  [450, 800],
];
const defaultImageBounds: L.LatLngBoundsExpression = [
  [0, 0],
  [450, 800],
];
const formSchema = z.object({
  number: z.number().min(1, "رقم العمارة مطلوب"),
  size: z.number().min(1, "المساحة مطلوبة"),
  projectId: z.string().min(1, "المشروع مطلوب"),
  buildingTypeId: z.string().min(1, "نوع العمارة مطلوب"),
  polygon: z.array(z.array(z.number())).min(4, "يجب تحديد 4 نقاط على الأقل لتكوين المستطيل"),
  status: z.enum(["avaliable", "reserved", "saled"]),
});

interface AddResidentialBuildingFormProps {
  setOpen: (open: boolean) => void;
  onAdd: (building: ResidentialBuilding) => void;
}

const AddResidentialBuildingForm = ({ setOpen, onAdd }: AddResidentialBuildingFormProps) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [buildingTypes, setBuildingTypes] = useState<BuildingType[]>([]);
  const [polygon, setPolygon] = useState<number[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsExpression>(defaultImageBounds);
  const [imageUrl, setImageUrl] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: 1,
      size: 100,
      projectId: "",
      buildingTypeId: "",
      polygon: [],
      status: "avaliable",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, buildingTypesData] = await Promise.all([
          getBuildingProjects(),
          getBuildingTypes(),
        ]);
        setProjects(projectsData);
        setBuildingTypes(buildingTypesData.items || []);
      } catch (error) {
        console.error("فشل في جلب البيانات:", error);
      }
    };
    fetchData();
  }, []);


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
    console.log("🚀 ~ onSubmit ~ values:", values)
    try {
      const buildingPayload = {
        number: values.number,
        size: values.size,
        projectId: values.projectId,
        buildingTypeId: values.buildingTypeId,
        status: values.status,
        polygon: values.polygon,
      };

      const newBuilding = await addResidentialBuilding(buildingPayload);
      onAdd(newBuilding);
      setOpen(false);
    } catch (error) {
      console.error("فشل في إضافة العمارة:", error);
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
                <FormLabel>رقم العمارة</FormLabel>
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

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المساحة (م²)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المشروع</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المشروع" />
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
              <Select value={field.value} onValueChange={field.onChange}>
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
              <Select onValueChange={field.onChange} value={field.value || "avaliable"}>
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
          <FormLabel>تحديد موقع العمارة على الخريطة</FormLabel>
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
          <MapClickHandler />
          
          {polygon.length >= 3 && (
            <Polygon
              positions={polygon}
              pathOptions={{
                color: "#3B82F6",
                fillColor: "#3B82F6",
                fillOpacity: 0.3,
                weight: 2,
              }}
            />
          )}
        </MapContainer>

        <Button
          className="w-full bg-green-600 hover:bg-green-500"
          type="submit"
          disabled={polygon.length < 4}
        >
          إضافة العمارة السكنية
        </Button>
      </form>
    </Form>
  );
};

export default AddResidentialBuildingForm;