"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { verifyOtp, resendOtp } from "@/src/services/auth";

// Inner form content separated for Suspense wrapping
function OtpVerificationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the email from URL query parameters dynamically
  const email = searchParams.get("email") || "";

  // Array of 6 elements to store the value of each OTP input box
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

  // Array of refs to control the focus on each input element programmatically
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer states (starts at 60 seconds)
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Status and loading states
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

  // Run timer countdown on mount
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Triggered when the user types a digit in one of the input fields
  const handleChange = (value: string, index: number) => {
    // Only allow single digits (0-9)
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input box if a value is typed and this is not the last box
    if (value && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Triggered when user presses a key (handles Backspace)
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

  // Handles resending the OTP code using separated auth services
  const handleResendClick = async () => {
    if (!email) {
      setErrorMessage("No email associated. Please register again.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsResending(true);

    try {
      // Calling our separated service
      const data = await resendOtp(email);

      if (data.success) {
        setSuccessMessage("Verification code resent successfully!");
        setCountdown(60);
        setCanResend(false);
      } else {
        setErrorMessage(data.message || "Failed to resend verification code.");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to connect. Please check your connection.");
    } finally {
      setIsResending(false);
    }
  };

  // Handles verifying the OTP code using separated auth services
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const fullCode = otp.join("");
    if (fullCode.length < 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    if (!email) {
      setErrorMessage("Missing email details. Please return to registration.");
      return;
    }

    setIsVerifying(true);

    try {
      // Calling our separated service
      const data = await verifyOtp(email, fullCode);

      if (data.success) {
        setSuccessMessage("Account verified successfully! Redirecting...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setErrorMessage(data.message || "Invalid verification code. Please check and try again.");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to connect. Please check your connection.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Helper to format email text gracefully (e.g. te**@example.com)
  const maskEmail = (emailStr: string) => {
    if (!emailStr) return "";
    const parts = emailStr.split("@");
    if (parts.length !== 2) return emailStr;
    const [name, domain] = parts;
    const maskedName = name.length > 2 ? `${name.substring(0, 2)}••••` : name;
    return `${maskedName}@${domain}`;
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
          <strong className="text-slate-700 font-semibold">
            {email ? maskEmail(email) : "your email"}
          </strong>. Enter the 6-digit code below.
        </p>
      </div>

      {/* 2. Error Message Banner */}
      {errorMessage && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs md:text-sm flex items-start gap-2.5">
          <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3. Success Message Banner */}
      {successMessage && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs md:text-sm flex items-start gap-2.5">
          <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* 4. OTP Code Verification Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
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
                className={`w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-bold bg-white text-slate-900 border rounded-xl shadow-xs transition-all duration-150 outline-none placeholder-slate-300
                  ${
                    inputRefs.current[index] === document.activeElement
                      ? "border-indigo-600 ring-2 ring-indigo-100"
                      : "border-slate-200 hover:border-slate-300"
                  }
                  ${digit ? "bg-indigo-50/20 border-indigo-300" : ""}
                `}
                disabled={isVerifying}
                autoComplete="one-time-code"
                inputMode="numeric"
              />
            ))}
          </div>
        </div>

        {/* 5. Action Button */}
        <button
          type="submit"
          disabled={isVerifying || otp.some(d => d === "")}
          className={`w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all duration-150 ease-in-out text-center text-xs md:text-sm cursor-pointer flex items-center justify-center gap-2
            ${(isVerifying || otp.some(d => d === "")) ? "opacity-60 cursor-not-allowed hover:bg-[#4f46e5]" : ""}
          `}
        >
          {isVerifying ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying Code...
            </>
          ) : (
            "Verify & Activate"
          )}
        </button>
      </form>

      {/* 6. Footer Links and Countdown */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center text-xs md:text-base">
        
        {/* Conditional rendering for resend vs countdown */}
        {canResend ? (
          <p className="text-slate-500">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendClick}
              disabled={isResending}
              className="text-[#4f46e5] font-semibold hover:underline cursor-pointer disabled:opacity-50"
            >
              {isResending ? "Resending..." : "Resend OTP"}
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

// Wrapper component providing the required Suspense boundary
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
