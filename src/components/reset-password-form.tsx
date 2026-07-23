"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, Suspense } from "react";
import toast from "react-hot-toast";
import { resetPassword } from "@/src/services/auth";
import { ShieldAlert, Eye, EyeOff } from "lucide-react";
import { resetPasswordSchema } from "@/src/schemas/auth.schema"; // Zod স্কিমা ইম্পোর্ট করা হলো

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("resetToken") || "";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({}); // এরর স্টেট ডিক্লেয়ার করা হলো

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!resetToken) {
      toast.error("Invalid or expired reset token. Please request a new OTP.");
      return;
    }

    setIsLoading(true);
    setErrors({}); // আগের এররগুলো রিসেট করা হলো

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Zod ভ্যালিডেশন চেক করা হচ্ছে
    const validation = resetPasswordSchema.safeParse({ newPassword, confirmPassword });

    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors); // নতুন এরর সেট করা হলো
      setIsLoading(false);
      return;
    }

    try {
      const data = await resetPassword(resetToken, newPassword);
      console.log(data); // Console log output for easy API verification

      if (data.success) {
        toast.success(data.message || "Password reset successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  // If there is no resetToken, show a premium Warning page instead of the form
  if (!resetToken) {
    return (
      <div className="text-center py-6">
        <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Invalid Reset Session</h2>
        <p className="text-sm text-slate-500 mb-6 px-2">
          The reset token is missing or has expired. Please go back and request a new OTP code.
        </p>
        <Link
          href="/forget-password"
          className="inline-block bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-2.5 px-5 rounded-xl shadow-sm text-xs md:text-sm cursor-pointer"
        >
          Request new OTP
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-90 flex flex-col justify-center">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2e3bb1] tracking-tight mb-2">
          Reset password
        </h1>
        <p className="text-slate-500 text-xs md:text-sm">
          Create a new secure password for your account.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="newPassword" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm pr-10 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1 font-medium">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-xs md:text-sm pr-10 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1 font-medium">{errors.confirmPassword}</p>
          )}
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
              Saving password...
            </>
          ) : (
            "Save password"
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-slate-500">Loading form...</span>
      </div>
    }>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
