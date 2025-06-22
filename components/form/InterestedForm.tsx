"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js/core'
import { Button } from "@/components/ui/button"
import { addInterest } from "@/lib/actions/map.actions"
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"

const formSchema = z.object({
  firstName: z.string({
    required_error: "First name is required.",
  }).min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string({
    required_error: "Second name is required.",
  }).min(2, {
    message: "Second name must be at least 2 characters.",
  }),
  phoneNumber: z
    .string({
      required_error: "Phone number is required.",
    })
    .min(10, {
      message: "Phone number must be at least 10 digits.",
    })
    .max(15, {
      message: "Phone number must be at most 15 digits.",
    }),
  area: z.string(), // لا نحتاج إلى enum لأنه سيتم تعيينه افتراضيًا
  unitId: z.string().optional(), // للوحدات السكنية
  apartmentId: z.string().optional(), // للشقق السكنية
  support: z.enum(["supported", "unsupported"], {
    required_error: "هذا الحقل مطلوب",
  }),
})

interface InterestedFormProps {
  setOpen: (open: boolean) => void;
  unitId?: string; // للوحدات السكنية
  apartmentId?: string; // للشقق السكنية
}

const InterestedForm = ({ setOpen, unitId, apartmentId }: InterestedFormProps) => {
  const t = useTranslations('BuildingViewPage');
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      area: "center", // ✅ القيمة الافتراضية
      unitId: unitId || undefined,
      apartmentId: apartmentId || undefined,
      support:"supported"
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // إرسال البيانات مع تحديد نوع الاهتمام
      const interestData = {
        ...values,
        // إضافة معرف الوحدة أو الشقة حسب النوع
        ...(unitId && { unitId }),
        ...(apartmentId && { apartmentId }),
      };

      await addInterest(interestData);
      setOpen(false);
      toast({
        title: "نجاح",
        description: "تم إرسال اهتمامك بنجاح!",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error during submission:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال اهتمامك",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* تسجيل الحقول المخفية */}
        {unitId && <input type="hidden" {...form.register("unitId")} value={unitId} />}
        {apartmentId && <input type="hidden" {...form.register("apartmentId")} value={apartmentId} />}
        {/* تسجيل الحقل المخفي area بقيمة افتراضية "center" */}
        <input type="hidden" {...form.register("area")} value="center" />

        <div className="grid gap-4 gap-y-8 grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FirstName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("FirstNamePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("SurName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("SurNamePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phoneNumber")}</FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry="SA"
                    placeholder="52356222"
                    international
                    withCountryCallingCode
                    value={field.value as E164Number | undefined}
                    onChange={field.onChange}
                    style={{ direction: t("language").toLowerCase() === "en" ? "rtl" : "ltr" }}
                    className="!mt-2 h-9 !rounded-md !px-3 !text-sm !border !bg-dark-400 !placeholder:text-dark-600 !border-dark-500 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
            control={form.control}
            name="support"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  اختار
                </FormLabel>
                <Select
                  dir="rtl"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="bg-white">
                    <SelectTrigger>
                      <SelectValue placeholder="جدة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white ">
                    {["supported", "unsupported"].map((item, i) => (
                      <SelectItem key={item + i} value={item}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <p>{t(`${item}`)}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="block w-full col-span-2 transition-all bg-green-600 hover:bg-green-500 text-lg h-fit"
            type="submit"
          >
            إرسال
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InterestedForm;