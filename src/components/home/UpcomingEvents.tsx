import Link from "next/link";
import React from "react";

// Event object type definition
interface UpcomingEvent {
  id: string;
  title: string;
  category: string;
  categoryBg: string;
  categoryTextColor: string;
  type: string;
  typeIcon: "in-person" | "online";
  date: {
    month: string;
    day: string;
    year: string;
  };
  location: string;
  seatsLeft: number;
  image: string;
}

const upcomingEvents: UpcomingEvent[] = [
  {
    id: "1",
    title: "Wellness & Movement Retreat",
    category: "Health",
    categoryBg: "bg-emerald-50",
    categoryTextColor: "text-emerald-600",
    type: "In-person",
    typeIcon: "in-person",
    date: { month: "JUL", day: "19", year: "2026" },
    location: "Green Valley Wellness Center",
    seatsLeft: 40,
    image: "/images/Image (4).png",
  },
  {
    id: "2",
    title: "Founders & Funders Networking Summit",
    category: "Business",
    categoryBg: "bg-teal-50",
    categoryTextColor: "text-teal-600",
    type: "In-person",
    typeIcon: "in-person",
    date: { month: "JUL", day: "30", year: "2026" },
    location: "Grand Horizon Hotel Ballroom",
    seatsLeft: 199,
    image: "/images/Link.png",
  },
  {
    id: "3",
    title: "Build with Design Systems — Live Workshop",
    category: "Workshop",
    categoryBg: "bg-purple-50",
    categoryTextColor: "text-purple-600",
    type: "Online",
    typeIcon: "online",
    date: { month: "AUG", day: "08", year: "2026" },
    location: "Zoom (link shared after registration)",
    seatsLeft: 59,
    image: "/images/Image (4).png",
  },
  {
    id: "4",
    title: "UX Research Fundamentals",
    category: "Education",
    categoryBg: "bg-emerald-50",
    categoryTextColor: "text-emerald-600",
    type: "Online",
    typeIcon: "online",
    date: { month: "AUG", day: "11", year: "2026" },
    location: "Microsoft Teams",
    seatsLeft: 50,
    image: "/images/Image (4).png",
  },
  {
    id: "5",
    title: "AI Product Bootcamp (Online)",
    category: "Education",
    categoryBg: "bg-emerald-50",
    categoryTextColor: "text-emerald-600",
    type: "Online",
    typeIcon: "online",
    date: { month: "AUG", day: "15", year: "2026" },
    location: "Google Meet",
    seatsLeft: 99,
    image: "/images/Image (5).png",
  },
  {
    id: "6",
    title: "Innovate 2026 — The Future of Technology",
    category: "Technology",
    categoryBg: "bg-indigo-50",
    categoryTextColor: "text-[#4f46e5]",
    type: "In-person",
    typeIcon: "in-person",
    date: { month: "AUG", day: "22", year: "2026" },
    location: "Metro Convention Center, Hall A",
    seatsLeft: 498,
    image: "/images/Image (5).png",
  },
];

export default function UpcomingEvents() {
  return (
    <section className="w-full bg-[#f8fafc]/60 py-16 md:py-20 border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Upcoming events
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-light">
              Explore dynamic events coming up soon.
            </p>
          </div>
          
          {/* View All Link */}
          <Link 
            href="/events" 
            className="flex items-center gap-1.5 text-sm font-semibold text-[#4f46e5] hover:text-indigo-700 transition group"
          >
            View all
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
              className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-white border border-slate-100 hover:border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group"
            >
              {/* Event Image & Date Badge */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-2xl flex flex-col items-center justify-center shadow-md border border-slate-100/50 min-w-[54px]">
                  <span className="text-[10px] font-bold tracking-wider text-[#4f46e5]">
                    {event.date.month}
                  </span>
                  <span className="text-xl font-extrabold text-slate-800 leading-none mt-0.5">
                    {event.date.day}
                  </span>
                </div>
              </div>

              {/* Event Details Content */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  {/* Category & Type Badges */}
                  <div className="flex items-center gap-2 mb-4">
                    {/* Category Pill */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${event.categoryBg} ${event.categoryTextColor}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {event.category}
                    </span>
                    
                    {/* Type Pill (Online / In-person) */}
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 bg-slate-100">
                      {event.typeIcon === "online" ? (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          className="h-3 w-3 mr-0.5"
                        >
                          <path d="m22 8-6 4 6 4V8Z"/>
                          <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
                        </svg>
                      ) : (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          className="h-3 w-3 mr-0.5"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      )}
                      {event.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-[#4f46e5] transition duration-150 mb-4 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Date and Location Rows */}
                  <div className="space-y-2.5 mb-6 text-slate-500 text-xs md:text-sm font-medium">
                    {/* Date Row */}
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-slate-400"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                      <span>{event.date.month === "JUL" ? "Jul" : "Aug"} {event.date.day}, {event.date.year}</span>
                    </div>

                    {/* Location Row */}
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Divider & Info */}
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs md:text-sm font-medium">
                  {/* Seats Left */}
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-slate-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span>{event.seatsLeft} seats left</span>
                  </div>

                  {/* View Details Link */}
                  <Link 
                    href={`/events/${event.id}`}
                    className="flex items-center gap-1 text-[#4f46e5] hover:text-indigo-700 transition font-semibold"
                  >
                    View details
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
