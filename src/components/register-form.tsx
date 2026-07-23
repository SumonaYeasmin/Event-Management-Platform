"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast"; // নোটিফিকেশন টোস্ট ইম্পোর্ট করা হলো
import { registerSchema } from "@/src/schemas/auth.schema"; // জড স্কিমা ইম্পোর্ট করা হলো

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false); // লোডিং বাটন কন্ট্রোলের জন্য স্টেট
  const [errors, setErrors] = useState<Record<string, string>>({}); // প্রতিটি ফিল্ডের আলাদা এরর রাখার স্টেট

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // সাবমিট করার শুরুতেই আগের সব এরর মুছে ফেলা হচ্ছে

    // ১. ফর্ম থেকে ইনপুট ডাটা নেওয়া হলো
    const formData = new FormData(e.currentTarget);
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // ২. Zod স্কিমা দিয়ে ডাটা ভ্যালিডেশন চেক করা হচ্ছে
    const validation = registerSchema.safeParse({
      fullname,
      email,
      password,
      confirmPassword,
    });

    // ৩. ভ্যালিডেশন ফেইল করলে ফিল্ড অনুযায়ী এরর সেট করবে এবং রিটার্ন করবে
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      
      // Zod এর সব এরর লুপ করে আমাদের errors অবজেক্টে ফিল্ড অনুযায়ী গুছিয়ে রাখছি
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string; // যেমন: "fullname", "email" ইত্যাদি
        newErrors[field] = issue.message; // Zod এর কাস্টম এরর মেসেজ
      });

      setErrors(newErrors); // স্টেটে এররগুলো সেট করা হলো
      setIsLoading(false);
      return;
    }

    try {
      // ৪. ভ্যালিডেশন সফল হলে ব্যাকএন্ড সার্ভারে পোস্ট রিকোয়েস্ট পাঠানো হচ্ছে
      const res = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message || "Registration successful! Please verify your email.");
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to connect to the backend server.");
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
          <label htmlFor="fullname" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
            Full name
          </label>
          <input
            id="fullname"
            name="fullname"
            type="text"
            placeholder="Jane Doe"
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.fullname && (
            <p className="text-red-500 text-sm mt-1 font-medium">{errors.fullname}</p>
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
