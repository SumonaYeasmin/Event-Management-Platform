

import React from 'react'
import { Calendar, CheckCircle2, Ticket, Users, ArrowRight, Plus, Clock } from 'lucide-react'
import Link from 'next/link'

interface RecentEvent {
  id: string
  title: string
  date: string
  category: string
  seats: string
  status: 'Published' | 'Pending' | 'Completed'
  image: string
}

const recentEvents: RecentEvent[] = [
  {
    id: '1',
    title: 'Innovate 2026 — The Future of Technology',
    date: 'Aug 22, 2026',
    category: 'Technology',
    seats: '2/500 seats',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '2',
    title: 'Founders & Funders Networking Summit',
    date: 'Jul 30, 2026',
    category: 'Business',
    seats: '1/200 seats',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '3',
    title: 'AI Product Bootcamp (Online)',
    date: 'Aug 15, 2026',
    category: 'Education',
    seats: '1/100 seats',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '4',
    title: 'Regional Startup Pitch Night',
    date: 'Sep 12, 2026',
    category: 'Business',
    seats: '0/150 seats',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '5',
    title: 'Spring Tech Conference 2026',
    date: 'Mar 14, 2026',
    category: 'Conference',
    seats: '1/400 seats',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=150'
  }
]

export default function OrganizerOverviewPage() {
  return (
    <div className="space-y-8 w-full">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm sm:text-base
           text-slate-500">
            Track your events and registrations at a glance.
          </p>
        </div>
        <Link 
          href="/organizer/dashboard/create-event" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all text-sm sm:text-base
           font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/10 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create event
        </Link>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Events */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm sm:text-base font-medium text-slate-500">Total events</span>
            <h3 className="text-3xl font-bold text-slate-900">5</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Published */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm sm:text-base
             font-medium text-slate-500">Published</span>
            <h3 className="text-3xl font-bold text-slate-900">3</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Total Registrations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm sm:text-base
             font-medium text-slate-500">Total registrations</span>
            <h3 className="text-3xl font-bold text-slate-900">5</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Ticket className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Avg. per Event */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm sm:text-base
             font-medium text-slate-500">Avg. per event</span>
            <h3 className="text-3xl font-bold text-slate-900">1</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 3. Recent Events */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Recent events</h2>
          <Link href="/organizer/dashboard/my-events" className="text-sm sm:text-base font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
            Manage all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Events list */}
        <div className="divide-y divide-slate-100">
          {recentEvents.map((event) => {
            const isCompleted = event.status === 'Completed';
            const isPending = event.status === 'Pending';
            return (
              <div key={event.id} className="py-4 flex flex-col lg:flex-row  gap-4 first:pt-0 last:pb-0">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4  ">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-28 w-48 rounded-lg object-cover bg-slate-100 shrink-0 "
                  />
                  <div className="space-y-1">
                    <h4 className="text-sm md:text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors leading-tight">
                      {event.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1.5 text-sm md:text-base text-slate-500">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{event.date}</span>
                      <span>•</span>
                      <span>{event.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-6 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-50">
                  <span className=" text-sm lg:text-base font-semibold text-slate-500">
                    {event.seats}
                  </span>
                  
                  {/* Status Badge */}
                  <span className={`text-sm lg:text-base font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                    isCompleted ? 'bg-slate-50 text-slate-600 border-slate-200' :
                    isPending ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      isCompleted ? 'bg-slate-400' :
                      isPending ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`} />
                    {event.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}