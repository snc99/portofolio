import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Animated Shapes - Simple moving shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Circle yang gerak */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-100 rounded-full animate-float-slow"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-50 rounded-full animate-float animation-delay-2000"></div>

        {/* Dots pattern yang gerak */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-200 rounded-full animate-ping opacity-50"></div>
        <div className="absolute bottom-20 right-40 w-3 h-3 bg-emerald-200 rounded-full animate-ping animation-delay-1000 opacity-50"></div>
        <div className="absolute top-40 right-60 w-2 h-2 bg-emerald-200 rounded-full animate-ping animation-delay-3000 opacity-50"></div>
        <div className="absolute bottom-40 left-60 w-4 h-4 bg-emerald-200 rounded-full animate-pulse"></div>

        {/* Square yang muter pelan */}
        <div className="absolute top-60 left-20 w-16 h-16 border-2 border-emerald-100 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-60 right-20 w-24 h-24 border-2 border-emerald-100 rotate-12 animate-spin-slower"></div>
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
