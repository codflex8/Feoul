import LoginForm from "@/components/form/LoginForm";

export default function LoginPage() {
  
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-r from-white to-purple-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">مرحبًا بعودتك!</h1>
          <p className="text-gray-600">الرجاء تسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}