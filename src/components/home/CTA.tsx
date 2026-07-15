import Link from "next/link";
import React from "react";

export default function CTA() {
  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Main CTA Card */}
        <div className="relative overflow-hidden bg-[#4f46e5] text-white rounded-3xl py-16 px-6 md:py-20 md:px-12 flex flex-col items-center justify-center text-center shadow-xl shadow-indigo-100/50">
          
          {/* Decorative Background Blobs */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-400/40 blur-3xl pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10 max-w-3xl flex flex-col items-center">
            
           
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
              Ready to host your own event?
            </h2>
            
      
            <p className="text-indigo-100 text-sm md:text-base md:text-[17px] font-normal leading-relaxed max-w-2xl mb-8 opacity-90">
              Become an organizer, publish with a click after admin approval, and track every registration in real time.
            </p>
            
         
            <Link 
              href="/register" 
              className="group bg-white text-[#4f46e5] hover:text-[#4338ca] hover:bg-slate-50 text-sm md:text-base font-bold px-7 py-4 rounded-2xl shadow-lg transition duration-200 flex items-center gap-2 cursor-pointer"
            >
              Get started free
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
                className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            
          </div>
        </div>

      </div>
    </section>
  );
}
