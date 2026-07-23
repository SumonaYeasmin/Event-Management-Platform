"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/dashboard/overview");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole")?.toLowerCase();
      if (role === "admin") {
        setDashboardHref("/admin/dashboard");
      } else if (role === "organizer") {
        setDashboardHref("/organizer/dashboard");
      } else {
        setDashboardHref("/dashboard/overview");
      }
    }
  }, [isDropdownOpen]); // Re-evaluate when dropdown is opened to catch state changes

  return (
    <nav className="bg-white border-b border-slate-100  sticky top-0 z-50! ">
 <div className="container mx-auto w-full  px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Left Branding */}
      <div className="flex-1 flex justify-start">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#4f46e5] text-white p-2 rounded-xl shadow-md shadow-indigo-100 group-hover:scale-105 transition">
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
          <span className="text-xl font-bold tracking-tight text-slate-900">EventHub</span>
        </Link>
      </div>

      {/* Middle Navigation Links - Centered */}
      <div className="hidden md:flex justify-center items-center gap-6">
        <Link href="/" className="text-sm font-semibold text-[#4f46e5] hover:text-indigo-700 transition">
          Home
        </Link>
        <Link href="/events" className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition">
          Browse Events
        </Link>
      </div>

      {/* Right Controls: User Profile with Dropdown */}
      <div className="flex-1 flex justify-end relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
        >
          {/* User Icon (Man Icon) & Avatar */}
          <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#4f46e5]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-4.5 w-4.5"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          
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
            className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            {/* Click-outside backdrop to close dropdown */}
            <div 
              className="fixed inset-0 z-40 cursor-default" 
              onClick={() => setIsDropdownOpen(false)}
            />
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right">
              {/* Dashboard Link */}
              <Link 
                href={dashboardHref} 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition font-medium"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 text-slate-500"
                >
                  <rect width="7" height="9" x="3" y="3" rx="1" />
                  <rect width="7" height="5" x="14" y="3" rx="1" />
                  <rect width="7" height="9" x="14" y="12" rx="1" />
                  <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
                Dashboard
              </Link>
              
              {/* Divider Line */}
              <div className="border-t border-slate-100 my-1" />

              {/* Logout Button */}
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  localStorage.removeItem("userRole");
                  toast.success("Logged out successfully!");
                  router.push("/login");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition font-semibold text-left cursor-pointer"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 text-red-500"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </nav>
   
  );
}
