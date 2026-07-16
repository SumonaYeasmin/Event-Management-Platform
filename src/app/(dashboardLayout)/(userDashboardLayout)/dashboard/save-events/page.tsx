import React from 'react'
import { Calendar, MapPin, Users, Bookmark, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface SavedEvent {
  id: string
  title: string
  category: string
  type: 'In-person' | 'Online'
  month: string
  day: string
  date: string
  location: string
  seatsLeft: string
  image: string
}

const savedEvents: SavedEvent[] = [
  {
    id: '1',
    title: 'Sunset Sound Festival',
    category: 'Music',
    type: 'In-person',
    month: 'SEP',
    day: '05',
    date: 'Sep 5, 2026',
    location: 'Riverside Park Grounds',
    seatsLeft: '1199 seats left',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    title: 'Build with Design Systems — Live Workshop',
    category: 'Workshop',
    type: 'Online',
    month: 'AUG',
    day: '08',
    date: 'Aug 8, 2026',
    location: 'Zoom (link shared after registration)',
    seatsLeft: '59 seats left',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '3',
    title: 'Founders & Funders Networking Summit',
    category: 'Business',
    type: 'In-person',
    month: 'JUL',
    day: '30',
    date: 'Jul 30, 2026',
    location: 'Grand Horizon Hotel Ballroom',
    seatsLeft: '199 seats left',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '4',
    title: 'AI Product Bootcamp (Online)',
    category: 'Education',
    type: 'Online',
    month: 'AUG',
    day: '15',
    date: 'Aug 15, 2026',
    location: 'Google Meet',
    seatsLeft: '99 seats left',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '5',
    title: 'Innovate 2026 — The Future of Technology',
    category: 'Technology',
    type: 'In-person',
    month: 'AUG',
    day: '22',
    date: 'Aug 22, 2026',
    location: 'Metro Convention Center, Hall A',
    seatsLeft: '498 seats left',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=400'
  }
]

export default function SaveEventsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Saved Events</h1>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {savedEvents.map((event) => {
          return (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
            >
              {/* Card Image Cover */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Month/Day Badge (Absolute positioned top-left) */}
                <div className="absolute top-4 left-4 rounded-xl bg-white/95 p-1 px-2.5 flex flex-col items-center justify-center shadow-xs border border-white/20 min-w-12 h-13">
                  <span className="text-[10px] font-extrabold text-indigo-600 tracking-wider">
                    {event.month}
                  </span>
                  <span className="text-base font-bold text-slate-800 leading-tight">
                    {event.day}
                  </span>
                </div>

                {/* Bookmark Button (Absolute positioned top-right) */}
                <button className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-xs border border-slate-100 cursor-pointer hover:bg-slate-50 active:scale-95 transition-all">
                  <Bookmark className="h-4 w-4 fill-indigo-600 text-indigo-600" />
                </button>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      event.category === 'Music' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      event.category === 'Workshop' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      event.category === 'Business' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                      event.category === 'Education' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {event.category}
                    </span>
                    
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                      {event.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors">
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <span>{event.seatsLeft}</span>
                  </div>

                  <button className="text-indigo-600 hover:text-indigo-800 transition-colors text-xs font-semibold flex items-center gap-0.5 cursor-pointer">
                    View details
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}