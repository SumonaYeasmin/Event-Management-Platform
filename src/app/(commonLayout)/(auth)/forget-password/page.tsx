import ForgetPasswordForm from "@/src/components/forget-password-form";

export default function ForgetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f1f5f9] p-4 md:p-8">
      {/* Centered Premium Card Container */}
      <div className="w-full max-w-md bg-[#fcfdfe] rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 px-6 py-10 md:px-10 lg:px-12">
        <ForgetPasswordForm />
      </div>
    </div>
  );
}
