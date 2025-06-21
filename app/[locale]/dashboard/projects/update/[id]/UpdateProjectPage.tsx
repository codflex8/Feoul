"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

import { updateProject } from "@/lib/actions/dashboard.actions";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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
import { toast } from "@/hooks/use-toast";

const customIcon = new L.Icon({
  iconUrl: "/assets/icons/marker-icon.png",
  shadowUrl: "/assets/icons/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapMarker = ({ onLocationChange, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      onLocationChange(lng.toString(), lat.toString());
    },
  });

  return position ? (
    <Marker position={position} icon={customIcon}></Marker>
  ) : null;
};

const projectFormSchema = z.object({
  number: z.coerce.string(),
  name: z.string().min(2, { message: "إسم المشروع يجب ألا يقل عن 5 أحرف" }),
  city: z.enum(["Jeddah", "Riyadh", "AL Madinah AL Munawwarah"], {
    required_error: "المدينة حقل مطلوب",
  }),
  status: z.enum(["posted", "draft", "deleted"], {
    required_error: "حالة المشروع حقل مطلوب",
  }),
  document: z.instanceof(File).array().optional(),
  lng: z.string(),
  lat: z.string(),
});

const UpdateProjectPage = ({ project }) => {
  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project,
  });

  const onSubmit = async (values: any) => {
    try {
      await updateProject(values, project?.id);

      toast({
        title: "نجاح",
        description: "تم تعديل المشروع بنجاح!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تعديل المشروع",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 gap-y-8 grid-cols-2 w-full"
        >
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم المشروع</FormLabel>
                <FormControl>
                  <Input className="bg-white" {...field} />
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
                <FormLabel>اسم المشروع</FormLabel>
                <FormControl>
                  <Input className="bg-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المدينة</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={project.city}
                >
                  <FormControl className="bg-white">
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["Jeddah", "Riyadh", "AL Madinah AL Munawwarah"].map(
                      (city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      )
                    )}
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
                <FormLabel>حالة المشروع</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={project.status}
                >
                  <FormControl className="bg-white">
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["posted", "draft", "deleted"].map((status) => (
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

          <div className="col-span-2">
            <p>حدد موقع المشروع على الخريطة</p>
            <MapContainer
              center={[parseFloat(project.lat), parseFloat(project.lng)]}
              zoom={12}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapMarker
                initialPosition={{
                  lat: parseFloat(project.lat),
                  lng: parseFloat(project.lng),
                }}
                onLocationChange={(lng: any, lat: any) => {
                  form.setValue("lng", lng);
                  form.setValue("lat", lat);
                }}
              />
            </MapContainer>
          </div>

          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  نموذج المشروع
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col">
                    {project?.projectDocUrl && (
                      <div className="mb-2">
                        <img
                          src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}${project.projectDocUrl}`}
                          alt="Current Floor Image"
                          className="max-w-[200px] mb-2"
                        />
                      </div>
                    )}

                    <FileUploader
                      files={field.value ?? []}
                      onChange={(files) => {
                        if (files?.length > 0) {
                          field.onChange(files);
                          project.projectDocUrl = null;
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="col-span-2 bg-blue-600 hover:bg-blue-500"
          >
            تعديل المشروع
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateProjectPage;
