import OtpVerificationForm from "@/src/components/otp-verification-form";

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f1f5f9] p-4 md:p-8">
      {/* Centered Card Container (Image section removed) */}
      <div className="w-full max-w-md bg-blue-200 rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 px-6 py-10 md:px-10 lg:px-12 bg-[#fcfdfe]">
        <OtpVerificationForm />
      </div>
    </div>
  );
}
