import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full flex flex-col">

      {/* 2. Hero Body Section */}
      <div className="relative bg-[#090d16] text-white overflow-hidden min-h-135.5 md:min-h-162.5 flex flex-col justify-between">
        
        {/* Background Image of Conference Room */}
        <div 
          className="absolute inset-0 bg-cover bg-center  "
          style={{
            backgroundImage: `url('/images/hero-img.png')`,
          }}
        />
        {/* Deep Navy/Black Gradient Overlay (Made lighter for better image visibility) */}
        <div className="absolute inset-0 bg-linear-to-r from-[#090d16]/80 via-[#090d16]/45 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#090d16]/80 via-transparent to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 w-full container mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-8 flex flex-col items-start space-y-6 flex-1 justify-center">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] md:text-xs font-semibold text-slate-200 tracking-wide">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-indigo-400"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
              <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z" />
            </svg>
            Discover events worth your time
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-2xl text-white">
            Find, register, and host <br />
            <span className=" bg-linear-to-r from-indigo-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              unforgettable events.
            </span>
          </h1>

          {/* Description Paragraph */}
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl font-light">
            From tech conferences to music festivals — browse curated events, 
            secure your seat in seconds, and manage everything from one clean dashboard.
          </p>

          {/* Call-to-action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-3 w-full sm:w-auto">
            <Link 
              href="/events" 
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm md:text-base font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-900/30 transition duration-150 flex items-center gap-2 cursor-pointer"
            >
              Browse events
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <Link 
              href="/register" 
              className="border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm md:text-base font-semibold px-6 py-3 rounded-xl transition duration-150 cursor-pointer"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* 3. Bottom Stats Grid Row */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 pb-10">
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-white/10">
            {/* Stat 1: Events live */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-indigo-400"
                >
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M13 5v2" />
                  <path d="M13 17v2" />
                  <path d="M13 11v2" />
                </svg>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-extrabold text-white tracking-tight">8</div>
                <div className="text-[10px] md:text-xs text-slate-400 font-medium">Events live</div>
              </div>
            </div>

            {/* Stat 2: Registrations */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-indigo-400"
                >
                  <path d="m3 16 4-4 4 4 6-6M21 8h-4v4" />
                </svg>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-extrabold text-white tracking-tight">7</div>
                <div className="text-[10px] md:text-xs text-slate-400 font-medium">Registrations</div>
              </div>
            </div>

            {/* Stat 3: Admin-verified */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-indigo-400"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-extrabold text-white tracking-tight">100%</div>
                <div className="text-[10px] md:text-xs text-slate-400 font-medium">Admin-verified</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
