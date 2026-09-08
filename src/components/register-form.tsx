"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast"; // নোটিফিকেশন টোস্ট ইম্পোর্ট করা হলো
import { loginUser, registerUser } from "@/src/services/auth";
import { registerSchema } from "@/src/schemas/auth.schema"; // জড স্কিমা ইম্পোর্ট করা হলো

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false); // লোডিং বাটন কন্ট্রোলের জন্য স্টেট
  const [errors, setErrors] = useState<Record<string, string>>({}); // প্রতিটি ফিল্ডের আলাদা এরর রাখার স্টেট

  // ফর্ম ইনপুটের জন্য স্টেট (ইনপুট ক্লিয়ার করার সুবিধার্থে)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // সাবমিট করার শুরুতেই আগের সব এরর মুছে ফেলা হচ্ছে

    const { name, email, password, confirmPassword } = formData;

    // ২. Zod স্কিমা দিয়ে ডাটা ভ্যালিডেশন চেক করা হচ্ছে
    const validation = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    // ৩. ভ্যালিডেশন ফেইল করলে ফিল্ড অনুযায়ী এরর সেট করবে এবং রিটার্ন করবে
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      
      // Zod এর সব এরর লুপ করে আমাদের errors অবজেক্টে ফিল্ড অনুযায়ী গুছিয়ে রাখছি
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string; // যেমন: "name", "email" ইত্যাদি
        newErrors[field] = issue.message; // Zod এর কাস্টম এরর মেসেজ
      });

      setErrors(newErrors); // স্টেটে এররগুলো সেট করা হলো
      setIsLoading(false);
      return;
    }

    try {
      // ৪. ভ্যালিডেশন সফল হলে ব্যাকএন্ড সার্ভারে পোস্ট রিকোয়েস্ট পাঠানো হচ্ছে
      const data = await registerUser({
        name,
        email,
        password,
        confirmPassword,
      });

      if (data.success) {
        // ফর্ম ইনপুট ক্লিয়ার করা হচ্ছে
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // রেসপন্স থেকে টোকেন ও ইউজার ডাটা নেওয়া হচ্ছে
        let accessToken = data.data?.accessToken || data.accessToken;
        let refreshToken = data.data?.refreshToken || data.refreshToken;
        let user = data.data?.user || data.user || data.data;
        let role = user?.role || "USER";

        // যদি ব্যাকএন্ড টোকেন রিটার্ন না করে থাকে তবে সাথে সাথে অটো-লগইন করা
        if (!accessToken) {
          try {
            const loginRes = await loginUser(email, password);
            if (loginRes.success) {
              accessToken = loginRes.data?.accessToken || loginRes.accessToken;
              refreshToken = loginRes.data?.refreshToken || loginRes.refreshToken;
              user = loginRes.data?.user || loginRes.user || loginRes.data;
              role = user?.role || role;
            }
          } catch (autoLoginErr) {
            console.error("Auto-login error after registration:", autoLoginErr);
          }
        }

        // টোকেন এবং রোল লোকালস্টোরেজ ও কুকিতে সেভ করা
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          document.cookie = `accessToken=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
        }
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        localStorage.setItem("userRole", role.toUpperCase());

        toast.success(data.message || "Registration successful! Redirecting to dashboard...");

        const normalizedRole = role.toLowerCase();

        // রোল অনুযায়ী সরাসরি ড্যাশবোর্ডে রিডাইরেক্ট করা
        setTimeout(() => {
          if (normalizedRole === "admin") {
            router.push("/admin/dashboard");
          } else if (normalizedRole === "organizer") {
            router.push("/organizer/dashboard");
          } else {
            router.push("/dashboard/overview");
          }
        }, 1200);
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to connect to the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-90 flex flex-col justify-center">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2e3bb1] tracking-tight mb-2">
          Create your account
        </h1>
        <p className="text-slate-500 text-xs md:text-sm">
          Join in seconds and start exploring events.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 font-medium">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 font-medium">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 font-medium">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="••••••••"
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1 font-medium">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out text-center text-xs md:text-sm cursor-pointer mt-2 flex items-center justify-center gap-2 ${
            isLoading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <div className="mt-5 text-center">
        <p className="text-xs md:text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#4f46e5] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center">
        <span className="inline-block px-3 py-1.5 bg-slate-100/80 rounded-lg text-[10px] text-slate-500 tracking-wide font-medium">
          Prototype: pick any role above — no real credentials needed.
        </span>
      </div>
    </div>
  );
}
