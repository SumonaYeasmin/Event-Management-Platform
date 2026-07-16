import React from 'react'
import { Calendar, MapPin, X } from 'lucide-react'

interface RegisteredEvent {
  id: string
  title: string
  category: string
  status: 'Completed' | 'Published'
  ended?: boolean
  date: string
  location: string
  image: string
}

const registeredEvents: RegisteredEvent[] = [
  {
    id: '1',
    title: 'Spring Tech Conference 2026',
    category: 'Conference',
    status: 'Completed',
    ended: true,
    date: 'Mar 14, 2026 · 9:00 AM',
    location: 'Metro Convention Center, Hall B',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '2',
    title: 'Founders & Funders Networking Summit',
    category: 'Business',
    status: 'Published',
    date: 'Jul 30, 2026 · 10:00 AM',
    location: 'Grand Horizon Hotel Ballroom',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '3',
    title: 'AI Product Bootcamp (Online)',
    category: 'Education',
    status: 'Published',
    date: 'Aug 15, 2026 · 6:00 PM',
    location: 'Google Meet',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '4',
    title: 'Innovate 2026 — The Future of Technology',
    category: 'Technology',
    status: 'Published',
    date: 'Aug 22, 2026 · 9:00 AM',
    location: 'Metro Convention Center, Hall A',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=300'
  }
]

export default function MyRegisterEventsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Registered Events</h1>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {registeredEvents.map((event) => {
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
              <div className="flex-1 space-y-3">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    event.category === 'Conference' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    event.category === 'Business' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                    event.category === 'Education' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}>
                    {event.category}
                  </span>
                  
                  {/* Status Badge */}
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                    isCompleted 
                      ? 'bg-slate-50 text-slate-600 border-slate-200' 
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      isCompleted ? 'bg-slate-400' : 'bg-emerald-500'
                    }`} />
                    {event.status}
                  </span>

                  {event.ended && (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      Ended
                    </span>
                  )}
                </div>

                {/* Event Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {event.title}
                </h3>

                {/* Event Details */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
                <button className="border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer">
                  Details
                </button>
                {!isCompleted && (
                  <button className="text-rose-600 hover:bg-rose-50 transition-colors text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer">
                    <X className="h-3.5 w-3.5" />
                    Cancel
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