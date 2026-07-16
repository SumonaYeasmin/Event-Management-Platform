import React from 'react'
import { Calendar, Clock, MapPin, Users, Check, X } from 'lucide-react'

interface PendingEvent {
  id: string
  title: string
  organizer: string
  organizerAvatar: string
  description: string
  date: string
  time: string
  location: string
  seats: string
  category: string
  image: string
}

const pendingEvents: PendingEvent[] = [
  {
    id: '1',
    title: 'testing only',
    organizer: 'Nova Events Co.',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova',
    description: 'only for testing purpose!',
    date: 'Jul 16, 2026',
    time: '9:00 AM',
    location: 'Dhaka',
    seats: '100 seats',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    title: 'Regional Startup Pitch Night',
    organizer: 'Nova Events Co.',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova',
    description: 'Ten startups pitch to a live panel. Awaiting review before going public.',
    date: 'Sep 12, 2026',
    time: '6:30 PM',
    location: 'Innovation Hub, Downtown',
    seats: '150 seats',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400'
  }
]

export default function PendingApprovalsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Pending Approvals</h1>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingEvents.map((event) => (
          <div 
            key={event.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
          >
            {/* Cover Image with Badges */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Status and Category Badges (Absolute positioned top-left) */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Pending review
                </span>
                
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border ${
                  event.category === 'Technology' 
                    ? 'bg-indigo-600/90 text-white border-indigo-500/20' 
                    : 'bg-sky-600/90 text-white border-sky-500/20'
                }`}>
                  {event.category}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-1 hover:text-indigo-600 cursor-pointer transition-colors">
                  {event.title}
                </h3>

                {/* Organizer info */}
                <div className="flex items-center gap-2">
                  <img 
                    src={event.organizerAvatar} 
                    alt={event.organizer} 
                    className="h-5 w-5 rounded-full bg-slate-100 object-cover shrink-0 border border-slate-200/50"
                  />
                  <span className="text-xs text-slate-400 font-semibold">
                    by {event.organizer}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 h-8">
                  {event.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-xs font-semibold text-slate-500 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                    <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{event.seats}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 flex-1 cursor-pointer transition-all active:scale-98 text-xs shadow-xs">
                  <Check className="h-3.5 w-3.5" />
                  Approve & publish
                </button>
                <button className="border border-slate-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 text-slate-600 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-98 text-xs">
                  <X className="h-3.5 w-3.5" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}