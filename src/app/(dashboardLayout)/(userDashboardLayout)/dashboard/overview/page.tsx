import React from 'react'
import { Ticket, CalendarDays, Bookmark, Clock, ArrowRight } from "lucide-react"
import Link from 'next/link'

export default function OverviewPage() {
  return (
    <div className="space-y-8  mx-auto">
      {/* ১. পেজ হেডার (Page Header) */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Welcome back 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here's what's coming up and what you've saved.
        </p>
      </div>

      {/* ২. স্ট্যাটস কার্ড গ্রিড (Stats Cards Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* কার্ড ১: নিবন্ধিত ইভেন্ট (Registered Events) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Registered events</span>
            <h3 className="text-3xl font-bold text-slate-900">4</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Ticket className="h-6 w-6" />
          </div>
        </div>

        {/* কার্ড ২: আসন্ন ইভেন্ট (Upcoming Events) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Upcoming</span>
            <h3 className="text-3xl font-bold text-slate-900">3</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CalendarDays className="h-6 w-6" />
          </div>
        </div>

        {/* কার্ড ৩: সংরক্ষিত ইভেন্ট (Saved Events) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Saved events</span>
            <h3 className="text-3xl font-bold text-slate-900">3</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bookmark className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* ৩. আসন্ন ইভেন্ট লিস্ট (Upcoming Events Section) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Your upcoming events</h2>
          <Link href="/dashboard/my-register-events" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* ইভেন্টের তালিকা */}
        <div className="divide-y divide-slate-100">
          {/* ইভেন্ট ১ */}
          <div className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=150"
                alt="Event cover"
                className="h-12 w-20 rounded-lg object-cover bg-slate-100"
              />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors">
                  Founders & Funders Networking Summit
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Jul 30, 2026</span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-100 px-3 py-1 rounded-full">
                Business
              </span>
            </div>
          </div>

          {/* ইভেন্ট ২ */}
          <div className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=150"
                alt="Event cover"
                className="h-12 w-20 rounded-lg object-cover bg-slate-100"
              />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors">
                  AI Product Bootcamp (Online)
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Aug 15, 2026</span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full">
                Education
              </span>
            </div>
          </div>

          {/* ইভেন্ট ৩ */}
          <div className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=150"
                alt="Event cover"
                className="h-12 w-20 rounded-lg object-cover bg-slate-100"
              />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors">
                  Innovate 2026 — The Future of Technology
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Aug 22, 2026</span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full">
                Technology
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}