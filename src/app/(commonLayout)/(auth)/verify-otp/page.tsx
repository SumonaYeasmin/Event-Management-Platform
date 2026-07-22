import OtpVerificationForm from "@/src/components/otp-verification-form";

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f1f5f9] p-4 md:p-8">
      {/* Centered Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-135.5 md:min-h-162.5 border border-slate-100">
        
        {/* Left side: Visual overlay */}
        <div className="relative hidden md:flex flex-col justify-between p-10 lg:p-12 text-white overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80')`, // Security/tech theme image
            }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#1e1b4b]/95 via-[#0f172a]/90 to-[#020617]/95 mix-blend-multiply" />

          {/* Top Branding Section */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-lg border border-white/20 shadow-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5 text-white"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">EventHub</span>
          </div>

          {/* Bottom Hero Text Section */}
          <div className="relative z-10 mt-auto max-w-sm">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-3 leading-tight">
              Keep your account secure.
            </h2>
            <p className="text-slate-300 text-xs lg:text-sm leading-relaxed font-light">
              We use multi-factor verification to secure your host and attendee actions. Enter the temporary passcode to proceed.
            </p>
          </div>
        </div>

        {/* Right side: Rendered Form Component */}
        <div className="flex flex-col justify-center items-center px-6 py-10 md:px-10 lg:px-14 bg-[#fcfdfe]">
          <OtpVerificationForm />
        </div>

      </div>
    </div>
  );
}
