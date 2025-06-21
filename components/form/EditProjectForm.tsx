"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import 'react-phone-number-input/style.css'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";

import { Input } from "@/components/ui/input"
import FileUploader from "@/components/dashboard/fileUploader"

interface LocationProps {
  lat: number;
  lng: number;
}

const projectFormSchema = z.object({
  number: z.string({
    required_error: "رقم المشروع مطلوب",
  }).min(2, {
    message: "رقم المشروع يجب ألا يقل عن حرفين",
  }),
  name: z.string({
    required_error: "إسم المشروع مطلوب",
  }).min(2, {
    message: "إسم المشروع يجب ألا يقل عن 5 أحرف",
  }),
  city: z.enum(["جدة", "الرياض", "المدينة المنورة"], {
    required_error: "المدينة حقل مطلوب",
  }),
  status: z.enum(["منشور", "مسودة", "محذوف"], {
    required_error: "حالة المشروع حقل مطلوب",
  }),
  buildingsNumber: z.number({
    required_error: "عدد الوحدات السكنية حقل مطلوب"
  }),
  design: z.string({
    required_error: "نموذج المشروع حقل مطلوب"
  }),
  // location: z.array<LocationProps>({
  //   required_error: "موقع المشروع حقل مطلوب",
  // })
})

const EditProjectForm = () => {

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      number: "",
      name: "",
      city: "جدة",
      status: "مسودة"
    },
  })

  const onSubmit = (values: z.infer<typeof projectFormSchema>) => {
    console.log(values)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 gap-y-8 grid-cols-2 w-full">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">رقم المشروع</FormLabel>
                <FormControl>
                  <Input className="bg-white"  {...field} value="005" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="min-w-[250px]">
                <FormLabel className="text-base font-semibold">اسم المشروع</FormLabel>
                <FormControl>
                  <Input className="bg-white" placeholder="سراة من فيول" {...field} />
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
                <FormLabel className="text-base font-semibold">المدينة</FormLabel>
                <Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="bg-white">
                    <SelectTrigger>
                      <SelectValue placeholder="جدة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white ">
                    {["جدة", "الرياض", "المدينة المنورة"].map((item, i) => (
                      <SelectItem key={item + i} value={item} >
                        <div className="flex items-center gap-2 cursor-pointer">
                          <p>{item}</p>
                        </div>
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
                <FormLabel className="text-base font-semibold">حالة المشورع</FormLabel>
                <Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="bg-white">
                    <SelectTrigger>
                      <SelectValue placeholder="منشور" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {["منشور", "مسودة", "محذوف"].map((item, i) => (
                      <SelectItem key={item + i} value={item}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <p>{item}</p>
                        </div>
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
            name="buildingsNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">عدد الوحدات السكنية</FormLabel>
                <FormControl>
                  <Input className="bg-white" placeholder="150"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="design"
            render={({ field }) => (
              <FormItem className="col-span-2 ">
                <FormLabel className="text-base font-semibold">نموذج المشروع</FormLabel>
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="block w-full col-span-2 transition-all bg-green-600 hover:bg-green-500 text-lg h-fit" type="submit">إضافة المشروع</Button>
        </form>
      </Form>
    </div>
  )
}

export default EditProjectForm;

