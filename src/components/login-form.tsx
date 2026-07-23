"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { loginUser } from "@/src/services/auth";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const data = await loginUser(email, password);
      console.log(data)

      if (data.success) {
        toast.success(data.message || "Login successful!");

        // Parse the user's role from the API response payload dynamically
        const user = data.data?.user || data.user || data.data;
        const role = user?.role || "user";

        // Save tokens and the user role to localStorage
        const accessToken = data.data?.accessToken || data.accessToken;
        const refreshToken = data.data?.refreshToken || data.refreshToken;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          // সার্ভার সাইড থেকে টোকেন অ্যাক্সেস করার জন্য কুকিতেও সেভ করা হচ্ছে
          document.cookie = `accessToken=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
        }
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userRole", role.toUpperCase());

        const normalizedRole = role.toLowerCase();

        setTimeout(() => {
          // Redirect dynamically based on the user's account role
          if (normalizedRole === "admin") {
            router.push("/admin/dashboard");
          } else if (normalizedRole === "organizer") {
            router.push("/organizer/dashboard");
          } else {
            router.push("/dashboard/overview");
          }
        }, 1500);
      } else {
        toast.error(data.message || "Invalid email or password.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-90 flex flex-col justify-center">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2e3bb1] tracking-tight mb-2">
          Sign in to your account
        </h1>
        <p className="text-slate-500 text-xs md:text-sm">
          Enter your credentials to access your dashboard.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="block text-xs md:text-sm font-semibold text-slate-700">
              Password
            </label>
            <Link href="/forget-password" className="text-xs text-[#4f46e5] hover:underline font-semibold">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out text-center text-xs md:text-sm cursor-pointer mt-2 flex items-center justify-center gap-2
            ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="mt-5 text-center">
        <p className="text-xs md:text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#4f46e5] font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
