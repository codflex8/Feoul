"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FaUser, FaLock } from "react-icons/fa";
import { Login } from "@/lib/actions/map.actions";
const loginSchema = z.object({
  username: z.string({
    required_error: "اسم المستخدم مطلوب"
  }),
  password: z.string({
    required_error: "كلمة المرور مطلوبة"
  }).min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  interface LoginResponse {
    token: string;
  }

  interface LoginFormData {
    username: string;
    password: string;
  }

    const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await Login(data);  
      console.log("🚀 ~ onSubmit ~ response:", response);
      
      document.cookie = `authToken=${response.token}; path=/; Secure; SameSite=Strict;`;
      router.push("/ar/dashboard");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "اسم المستخدم أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    }
  };
  
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 mb-2">
                  <FaUser className="text-gray-500" />
                  <span className="text-base font-semibold">اسم المستخدم</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسم المستخدم" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 mb-2">
                <FaLock className="text-gray-500" />
                  <span className="text-base font-semibold">كلمة المرور</span>
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="أدخل كلمة المرور" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          تسجيل الدخول
        </Button>
      </form>
    </Form>
  );
}
