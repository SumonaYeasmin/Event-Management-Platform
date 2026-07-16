import React from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'

interface AdminEvent {
  id: string
  title: string
  organizer: string
  date: string
  category: string
  status: 'Published' | 'Pending' | 'Rejected' | 'Draft' | 'Completed'
  image: string
}

const adminEvents: AdminEvent[] = [
  {
    id: '1',
    title: 'Innovate 2026 — The Future of Technology',
    organizer: 'Nova Events Co.',
    date: 'Aug 22, 2026',
    category: 'Technology',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '2',
    title: 'Sunset Sound Festival',
    organizer: 'Harmony Live',
    date: 'Sep 5, 2026',
    category: 'Music',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '3',
    title: 'Founders & Funders Networking Summit',
    organizer: 'Nova Events Co.',
    date: 'Jul 30, 2026',
    category: 'Business',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '4',
    title: 'Build with Design Systems — Live Workshop',
    organizer: 'Skillforge',
    date: 'Aug 8, 2026',
    category: 'Workshop',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '5',
    title: 'AI Product Bootcamp (Online)',
    organizer: 'Nova Events Co.',
    date: 'Aug 15, 2026',
    category: 'Education',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '6',
    title: 'Wellness & Movement Retreat',
    organizer: 'Harmony Live',
    date: 'Jul 19, 2026',
    category: 'Health',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '7',
    title: 'Regional Startup Pitch Night',
    organizer: 'Nova Events Co.',
    date: 'Sep 12, 2026',
    category: 'Business',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=150'
  }
]

export default function AllEventsPage() {
  return (
    <div className="space-y-6 w-full">


      {/* Filter Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm shadow-indigo-600/10 cursor-pointer">
          All <span className="ml-1 opacity-80">12</span>
        </button>
        <button className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
          Published <span className="ml-1 text-slate-400">8</span>
        </button>
        <button className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
          Pending <span className="ml-1 text-slate-400">1</span>
        </button>
        <button className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
          Rejected <span className="ml-1 text-slate-400">1</span>
        </button>
        <button className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
          Draft <span className="ml-1 text-slate-400">1</span>
        </button>
        <button className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
          Completed <span className="ml-1 text-slate-400">1</span>
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {adminEvents.map((event) => {
          const isPublished = event.status === 'Published';
          const isPending = event.status === 'Pending';
          const isCompleted = event.status === 'Completed';

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
                    event.category === 'Music' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    event.category === 'Workshop' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                    'bg-teal-50 text-teal-600 border-teal-100'
                  }`}>
                    {event.category}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {event.title}
                </h3>

                {/* Organizer & Date */}
                <p className="text-xs text-slate-500 font-medium">
                  {event.organizer} · {event.date}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end shrink-0">
                {isPending ? (
                  <>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-xs shadow-xs">
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button className="border border-slate-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 text-slate-600 font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-xs">
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button className="border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                      View
                    </button>
                    {isPublished && (
                      <button className="border border-amber-200 hover:bg-amber-50 text-amber-600 transition-colors text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                        <EyeOff className="h-3.5 w-3.5 text-amber-500" />
                        Unpublish
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}