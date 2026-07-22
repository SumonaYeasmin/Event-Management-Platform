"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect, Suspense } from "react";

// We separate the inner form content so Next.js can wrap it in a Suspense boundary.
// useSearchParams() requires Suspense for static build rendering in Next.js.
function OtpVerificationFormContent() {
  const searchParams = useSearchParams();
  
  // 1. Get the email from URL query parameters dynamically
  const email = searchParams.get("email") || "you@example.com";

  // 2. Array of 6 elements to store the value of each OTP input box
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

  // 3. Array of refs to control the focus on each input element programmatically
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 4. Countdown timer state (seconds remaining)
  const [countdown, setCountdown] = useState<number>(60);
  
  // 5. Boolean to track if user can click the resend button
  const [canResend, setCanResend] = useState<boolean>(false);

  // NEW STATES: 6. States for loading spinners and alert message banners
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Automatically focus the first input box when the component loads
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Run timer on mount and decrement it every second until it hits 0
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer); // Cleanup timer if component unmounts
    } else {
      setCanResend(true); // Countdown reached 0, user can now resend
    }
  }, [countdown]);

  // Triggered when the user types a digit in one of the input fields
  const handleChange = (value: string, index: number) => {
    // Regular expression: Allow only single digits (0-9). Disallow other characters.
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input box if a value is typed and this is not the last box (index < 5)
    if (value && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Triggered when user presses a key (helps us handle Backspace key specifically)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      // If the current box is empty and we are not in the first box, shift focus back
      if (!otp[index] && index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          
          // Also clear the value in the previous box
          const newOtp = [...otp];
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
      } else {
        // If the current box has a value, just clear the current box
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

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
        <span>Type numbers only. The cursor will automatically shift to the next box.</span>
      </div>

      {/* 3. OTP Code Verification Form */}
      <form className="space-y-6">
        <div>
          <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-3">
            Verification Code
          </label>
          
          {/* Grid/Flex container for the 6 boxes */}
          <div className="flex justify-between items-center gap-2 md:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
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
      <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center text-xs md:text-base">
        
        {/* Conditional rendering for resend vs countdown */}
        {canResend ? (
          <p className="text-slate-500">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={() => {
                // Restart timer when resend button is clicked
                setCountdown(60);
                setCanResend(false);
              }}
              className="text-[#4f46e5] font-semibold hover:underline cursor-pointer"
            >
              Resend OTP
            </button>
          </p>
        ) : (
          <p className="text-slate-500 flex items-center gap-1.5 justify-center">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Resend code in{" "}
            <span className="font-semibold text-slate-700">
              0:{countdown.toString().padStart(2, "0")}
            </span>
          </p>
        )}

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

// Wrapper component providing the required Suspense boundary for next/navigation hooks
export default function OtpVerificationForm() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center space-y-4">
        <svg className="animate-spin h-8 w-8 text-[#4f46e5]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-slate-500 text-sm">Loading verification...</span>
      </div>
    }>
      <OtpVerificationFormContent />
    </Suspense>
  );
}
