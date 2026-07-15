import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d1d42] text-slate-400 py-12 border-t border-slate-800/80">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Top Section - 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
          
          {/* Left Side: Logo, Description & Social Icons */}
          <div className="flex flex-col space-y-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-[#4f46e5] text-white p-2 rounded-xl shadow-md shadow-indigo-950/50 group-hover:scale-105 transition">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-5 w-5"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">EventHub</span>
            </Link>
            
            {/* Description */}
            <p className="text-sm text-slate-400 font-light leading-relaxed max-w-sm">
              Discover and register for amazing events, conferences, and workshops, or host your own with our easy-to-use platform.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#4f46e5] hover:text-white transition text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#4f46e5] hover:text-white transition text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#4f46e5] hover:text-white transition text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#4f46e5] hover:text-white transition text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Right Side: Shortcut Links */}
          <div className="flex flex-col md:items-end justify-center">
            <div className="flex flex-col space-y-3">
              <h3 className="text-white text-sm font-semibold tracking-wide uppercase md:text-right">Quick Links</h3>
              <ul className="space-y-2.5 text-sm font-medium flex flex-col md:items-end">
                <li>
                  <Link href="/" className="text-slate-400 hover:text-indigo-400 transition">Home</Link>
                </li>
                <li>
                  <Link href="/events" className="text-slate-400 hover:text-indigo-400 transition">Browse Events</Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-400 hover:text-indigo-400 transition">Register Account</Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-slate-400 hover:text-indigo-400 transition">Organizer Dashboard</Link>
                </li>
              </ul>
            </div>
          </div>

        </div>
        
        {/* Bottom Section - Copyright */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs md:text-sm text-slate-500 font-light">
            &copy; {new Date().getFullYear()} EventHub. All rights reserved.
          </div>
          <div className="text-xs md:text-sm text-slate-500 font-light flex items-center gap-1.5">
            Designed & Built for 
            <span className="text-indigo-400 font-semibold hover:text-indigo-300 transition cursor-pointer">EventHub Team</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
