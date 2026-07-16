import React from 'react'
import { Users, Edit, Eye, Plus } from 'lucide-react'
import Link from 'next/link'

interface OrganizerEvent {
  id: string
  title: string
  date: string
  category: string
  registered: string
  status: 'Published' | 'Pending' | 'Completed'
  image: string
  hasViewButton?: boolean
}

const organizerEvents: OrganizerEvent[] = [
  {
    id: '1',
    title: 'Innovate 2026 — The Future of Technology',
    date: 'Aug 22, 2026',
    category: 'Technology',
    registered: '2/500 registered',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=150',
    hasViewButton: true
  },
  {
    id: '2',
    title: 'Founders & Funders Networking Summit',
    date: 'Jul 30, 2026',
    category: 'Business',
    registered: '1/200 registered',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=150',
    hasViewButton: true
  },
  {
    id: '3',
    title: 'AI Product Bootcamp (Online)',
    date: 'Aug 15, 2026',
    category: 'Education',
    registered: '1/100 registered',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=150',
    hasViewButton: true
  },
  {
    id: '4',
    title: 'Regional Startup Pitch Night',
    date: 'Sep 12, 2026',
    category: 'Business',
    registered: '0/150 registered',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=150',
    hasViewButton: false
  },
  {
    id: '5',
    title: 'Spring Tech Conference 2026',
    date: 'Mar 14, 2026',
    category: 'Conference',
    registered: '1/400 registered',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=150',
    hasViewButton: false
  }
]

export default function MyEventsPage() {
  return (
    <div className="space-y-6 w-full">


      {/* Filter Badges and Create Event Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm shadow-indigo-600/10 cursor-pointer">
            All <span className="ml-1 opacity-80">5</span>
          </button>
          <button className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
            Draft <span className="ml-1 text-slate-400">0</span>
          </button>
          <button className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
            Pending <span className="ml-1 text-slate-400">1</span>
          </button>
          <button className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
            Published <span className="ml-1 text-slate-400">3</span>
          </button>
          <button className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
            Rejected <span className="ml-1 text-slate-400">0</span>
          </button>
          <button className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
            Completed <span className="ml-1 text-slate-400">1</span>
          </button>
        </div>

        {/* Create Event Button */}
        <Link 
          href="/organizer/dashboard/create-event" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/10 cursor-pointer self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create event
        </Link>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {organizerEvents.map((event) => {
          const isCompleted = event.status === 'Completed';
          const isPending = event.status === 'Pending';
          return (
            <div
              key={event.id}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center gap-5"
            >
              {/* Event Image */}
              <img
                src={event.image}
                alt={event.title}
                className="w-full md:w-36 h-24 rounded-xl object-cover bg-slate-100 shrink-0"
              />

              {/* Event Info */}
              <div className="flex-1 space-y-2">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
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

                  {/* Category Badge */}
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    event.category === 'Technology' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                    event.category === 'Business' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                    event.category === 'Education' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}>
                    {event.category}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {event.title}
                </h3>

                {/* Date & Registered info */}
                <p className="text-xs text-slate-500 font-medium">
                  {event.date} · {event.registered}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end shrink-0">
                <button className="border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  Participants
                </button>
                <button className="border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <Edit className="h-3.5 w-3.5 text-slate-400" />
                  Edit
                </button>
                {event.hasViewButton && (
                  <button className="border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    View
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}