"use client";

import Link from "next/link";
import React from "react";

export default function OtpVerificationForm() {
  // We'll use a static placeholder email for now
  const email = "you@example.com";

  return (
    <div className="w-full max-w-md flex flex-col justify-center">
      {/* 1. Page Header / Headings */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2e3bb1] tracking-tight mb-2">
          Verify your account
        </h1>
        <p className="text-slate-500 text-xs md:text-sm">
          We sent a verification code to{" "}
          <strong className="text-slate-700 font-semibold">{email}</strong>. 
          Enter the 6-digit code below.
        </p>
      </div>

      {/* 2. Static Alert Message (Example: Success/Error states) */}
      <div className="mb-6 p-3 bg-indigo-50/50 border border-indigo-100 text-indigo-700 rounded-lg text-xs md:text-sm flex items-start gap-2.5">
        <svg className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Please check your email inbox (and spam folder) for the verification code.</span>
      </div>

      {/* 3. OTP Code Verification Form */}
      <form className="space-y-6">
        <div>
          <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-3">
            Verification Code
          </label>
          
          {/* Grid/Flex container for the 6 boxes */}
          <div className="flex justify-between items-center gap-2 md:gap-3">
            {/* 6 input fields styled as static boxes */}
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                placeholder="•"
                className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-bold bg-white text-slate-900 border border-slate-200 rounded-xl shadow-xs transition-all duration-150 outline-none placeholder-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                inputMode="numeric"
              />
            ))}
          </div>
        </div>

        {/* 4. Action Button */}
        <button
          type="submit"
          className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all duration-150 ease-in-out text-center text-xs md:text-sm cursor-pointer flex items-center justify-center gap-2"
        >
          Verify & Activate
        </button>
      </form>

      {/* 5. Footer Links and Countdown */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center text-xs md:text-sm">
        {/* Resend Countdown Indicator */}
        <p className="text-slate-500 flex items-center gap-1.5 justify-center">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Resend code in{" "}
          <span className="font-semibold text-slate-700">0:59</span>
        </p>

        {/* Navigation back */}
        <div className="mt-4 border-t border-slate-100 pt-4 w-full text-center">
          <Link href="/register" className="text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to registration
          </Link>
        </div>
      </div>
    </div>
  );
}
