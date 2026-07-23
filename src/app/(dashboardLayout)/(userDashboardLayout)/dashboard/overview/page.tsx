import React from 'react'
import { Ticket, CalendarDays, Bookmark, Clock, ArrowRight } from "lucide-react"
import Link from 'next/link'

export default function OverviewPage() {
  return (
    <div className="space-y-6 md:space-y-8 mx-auto">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          Welcome back 👋
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Here's what's coming up and what you've saved.
        </p>
      </div>

      {/* 2. Responsive Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Registered Events */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs md:text-sm font-medium text-slate-500">Registered events</span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">4</h3>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Ticket className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>

        {/* Card 2: Upcoming Events */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs md:text-sm font-medium text-slate-500">Upcoming</span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">3</h3>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CalendarDays className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>

        {/* Card 3: Saved Events */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-xs md:text-sm font-medium text-slate-500">Saved events</span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">3</h3>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Bookmark className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>
      </div>

      {/* 3. Upcoming Events Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 md:p-6">
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <h2 className="text-base md:text-lg font-bold text-slate-900">Your upcoming events</h2>
          <Link href="/dashboard/my-register-events" className="text-[11px] md:text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Events List */}
        <div className="divide-y divide-slate-100">
          {/* Event 1 */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 first:pt-0 last:pb-0">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=150"
                alt="Event cover"
                className="h-12 w-20 lg:h-32 lg:w-40 rounded-lg object-cover bg-slate-100 shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs md:text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2">
                  Founders & Funders Networking Summit
                </h4>
                <div className="flex items-center gap-1.5 text-xs md:text-base text-slate-500">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>Jul 30, 2026</span>
                </div>
              </div>
            </div>
            <div className="self-start sm:self-auto ml-[92px] sm:ml-0">
              <span className="text-xs md:text-base font-semibold bg-sky-50 text-sky-600 border border-sky-100 px-3 py-1 rounded-full">
                Business
              </span>
            </div>
          </div>

          {/* Event 2 */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 first:pt-0 last:pb-0">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=150"
                alt="Event cover"
                className="h-12 w-20 lg:h-32 lg:w-40 rounded-lg object-cover bg-slate-100 shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs md:text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2">
                  AI Product Bootcamp (Online)
                </h4>
                <div className="flex items-center gap-1.5 text-xs md:text-base text-slate-500">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>Aug 15, 2026</span>
                </div>
              </div>
            </div>
            <div className="self-start sm:self-auto ml-[92px] sm:ml-0">
              <span className="text-xs md:text-base font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full">
                Education
              </span>
            </div>
          </div>

          {/* Event 3 */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 first:pt-0 last:pb-0">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <img
                src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=150"
                alt="Event cover"
                className="h-12 w-20 lg:h-32 lg:w-40 rounded-lg object-cover bg-slate-100 shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs md:text-sm lg:text-lg font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2">
                  Innovate 2026 — The Future of Technology
                </h4>
                <div className="flex items-center gap-1.5 text-sm lg:text-base text-slate-500">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>Aug 22, 2026</span>
                </div>
              </div>
            </div>
            <div className="self-start sm:self-auto ml-[92px] sm:ml-0">
              <span className="text-xs md:text-base font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full">
                Technology
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}