"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FileUploader from "@/components/dashboard/fileUploader";
import { toast } from "@/hooks/use-toast";
import {
  addUnit,
  getProjects,
  getCategories,
} from "@/lib/actions/dashboard.actions";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
 delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});
const imageUrl = "/assets/images/project.jpg";
const imageBounds = [
  [0, 0],
  [450, 800],
];

const buildFormSchema = z.object({
  number: z.number().min(1, "رقم المبنى مطلوب"),
  name: z.string().min(2, "إسم المبنى يجب ألا يقل عن 5 أحرف"),
  projectId: z.string().min(1, "رقم المشروع مطلوب"),
  categoryId: z.string().min(1, "رقم التصنيف مطلوب"),
  price: z.number().min(1, "سعر البيع مطلوب"),
  landSpace: z.number().min(1, "مساحة الأرض مطلوبة"),
  buildSpace: z.number().min(1, "مساحة البناء مطلوبة"),
  saledSpace: z.number().min(1, "المساحة البيعية مطلوبة"),
  bedroomNumber: z.number().min(1, "عدد غرف النوم مطلوب"),
  bathroomNumber: z.number().min(1, "عدد الحمامات مطلوب"),
  videoUrl: z.string().url("رابط الفيديو غير صالح").optional().nullable(),
  type: z.enum(["villa", "townhouse"]),
  status: z.enum(["avaliable", "reserved", "saled"]),
  buildStatus: z.enum(["no_construction", "construction"]),
  buildLevel: z.number().min(1, "حدد مرحلة البناء"),
  position_x: z.number().min(1, "موقع X مطلوب"),
  position_y: z.number().min(1, "موقع Y مطلوب"),
});

const AddUnitForm = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [position, setPosition] = useState({ lat: 0.0, lng: 0.0 });

  useEffect(() => {
    const fetchData = async () => {
      const projectsData = await getProjects();
      const categoriesData = await getCategories();

      setProjects(projectsData);
      setCategories(categoriesData.items || []);
    };
    fetchData();
  }, []);

  const form = useForm({
    resolver: zodResolver(buildFormSchema),
    defaultValues: {
      number: 1,
      name: "",
      projectId: "",
      categoryId: "",
      price: 0,
      landSpace: 0,
      buildSpace: 0,
      saledSpace: 0,
      bedroomNumber: 1,
      bathroomNumber: 1,
      videoUrl: null,
      type: "villa",
      status: "avaliable",
      buildStatus: "no_construction",
      buildLevel: 1,
      position_x: 0,
      position_y: 0,
    },
  });
  const onSubmit = async (values) => {
    const formattedValues = {
      ...values,
      number: Number(values.number),
      price: Number(values.price),
      landSpace: Number(values.landSpace),
      buildSpace: Number(values.buildSpace),
      saledSpace: Number(values.saledSpace),
      bedroomNumber: Number(values.bedroomNumber),
      bathroomNumber: Number(values.bathroomNumber),
      buildLevel: Number(values.buildLevel),
      position_x: Number(values.position_x),
      position_y: Number(values.position_y),
      videoUrl: values.videoUrl || "",
      floorsNumber: Number(values.floorsNumber) || 3, 
    };
  
    console.log("🚀 ~ onSubmit ~ formattedValues:", formattedValues);
  
    try {
      console.log("📡 Sending request to addUnit...");
      const response = await addUnit(formattedValues);
      console.log("✅ addUnit response:", response);
  
      toast({
        title: "نجاح",
        description: "تم إضافة الوحدة بنجاح!",
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Error in addUnit:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الوحدة",
        variant: "destructive",
      });
    }
  };
  
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

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم المبنى</FormLabel>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المبنى</FormLabel>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اختر التصنيف</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر تصنيف" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>سعر البيع</FormLabel>
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

          <FormField
            control={form.control}
            name="saledSpace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المساحة البيعية</FormLabel>
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

          <Button type="submit">إضافة الوحدة</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddUnitForm;
