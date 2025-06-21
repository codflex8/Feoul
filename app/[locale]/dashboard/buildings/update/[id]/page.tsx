"use client";

import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
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
  updateUnit,
  getProjects,
  getCategories,
  getUnitById,
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
  saledSpace: z
    .union([z.number(), z.literal("")])
    .optional()
    .nullable(),
  bedroomNumber: z.number().min(1, "عدد غرف النوم مطلوب"),
  bathroomNumber: z.number().min(1, "عدد الحمامات مطلوب"),
  videoUrl: z
    .union([z.string().url("رابط الفيديو غير صالح"), z.literal("")])
    .optional()
    .nullable(),
  type: z.enum(["villa", "townhouse"]),
  status: z.enum(["avaliable", "reserved", "saled"]),
  buildStatus: z.enum(["no_construction", "construction"]),
  buildLevel: z.number().min(1, "حدد مرحلة البناء"),
  position_x: z
    .union([
      z.number(),
      z.string().transform((val) => (val === "" ? null : Number(val))),
    ])
    .nullable(),
  position_y: z
    .union([
      z.number(),
      z.string().transform((val) => (val === "" ? null : Number(val))),
    ])
    .nullable(),
});

const EditUnitForm = () => {
  const { id: unitId } = useParams();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [position, setPosition] = useState({ lat: 0.0, lng: 0.0 });
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(buildFormSchema),
    defaultValues: unit || {},
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsData, categoriesData, unitData] = await Promise.all([
          getProjects(),
          getCategories(),
          getUnitById(unitId),
        ]);
        setProjects(projectsData);
        setCategories(categoriesData.items || []);
        setUnit(unitData);

        form.reset({
          ...unitData,
          position_x: unitData.position ? unitData.position[0] : 0,
          position_y: unitData.position ? unitData.position[1] : 0,
        });

        setPosition({
          lat: unitData.position ? unitData.position[0] : 0,
          lng: unitData.position ? unitData.position[1] : 0,
        });
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [unitId, form]);

  useEffect(() => {
    if (unit) {
      form.reset({
        number: unit.number || 1,
        name: unit.name || "",
        projectId: unit.project?.id || "",
        categoryId: unit.category?.id || "",
        price: unit.price || 0,
        landSpace: unit.landSpace || 0,
        buildSpace: unit.buildSpace || 0,
        saledSpace: unit.saledSpace || 0,
        bedroomNumber: unit.bedroomNumber || 1,
        bathroomNumber: unit.bathroomNumber || 1,
        videoUrl: unit.videoUrl || "",
        type: unit.type || "villa",
        status: unit.status || "avaliable",
        buildStatus: unit.buildStatus || "no_construction",
        buildLevel: unit.buildLevel || 1,
        position_x: unit.position ? unit.position[0] : 0,
        position_y: unit.position ? unit.position[1] : 0,
      });
      setPosition({
        lat: unit.position ? unit.position[0] : 0,
        lng: unit.position ? unit.position[1] : 0,
      });
    }
  }, [unit, form]);

  const onSubmit = async (values) => {
    try {
      await updateUnit(unitId, values);
      toast({
        title: "نجاح",
        description: "تم تعديل الوحدة بنجاح!",
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Error in updateUnit:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تعديل الوحدة",
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

    return position.lat && position.lng ? <Marker position={position} /> : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">جارٍ تحميل البيانات...</p>
      </div>
    );
  }

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
                  defaultValue={unit?.project?.id}
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
                  defaultValue={unit?.category?.id}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حالة الوحدة</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={unit?.status}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="reserved">محجوز</SelectItem>
                    <SelectItem value="saled">مباع</SelectItem>
                    <SelectItem value="avaliable">متاح</SelectItem>
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
                    value={field.value || unit?.saledSpace}
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

          <Button type="submit">تعديل الوحدة</Button>
        </form>
      </Form>
    </div>
  );
};

export default EditUnitForm;
