"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/shared/validation/auth.schema";
import { authService } from "@/modules/auth/auth.client";

export const LoginForm = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validation = LoginSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });

      setIsLoading(false);
      return;
    }

    try {
      const res = await authService.login(form);
      console.log(res);

      if (res.success) {
        router.replace("/dashboard");
      }
    } catch (err) {
      setErrors({ general: err as string });
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white text-2xl font-bold rounded-2xl mb-4 shadow-lg shadow-emerald-200">
          IS
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Hello Again!</h1>
        <p className="text-gray-500 mt-1">Welcome Back</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {errors.general && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-600 text-center">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@email.com"
              className={`w-full px-4 py-3 border ${
                errors.email ? "border-red-300" : "border-gray-200"
              } rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 text-gray-900 placeholder-gray-400`}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="**********"
              className={`w-full px-4 py-3 border ${
                errors.password ? "border-red-300" : "border-gray-200"
              } rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 text-gray-900 placeholder-gray-400`}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center">
            <a
              href="/"
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
            >
              Kembali ke beranda
            </a>
          </div>
        </form>
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">
        © 2026 Irvan Sandy. All rights reserved.
      </p>
    </>
  );
};
