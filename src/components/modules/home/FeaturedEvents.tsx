"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getPublicEvents } from "@/src/services/event.service";

interface EventItem {
  id: string;
  title: string;
  category: string;
  eventType: string;
  date: string;
  location: string;
  availableSeats: number;
  bannerImage?: string;
  ticketPrice: number;
}

export default function FeaturedEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await getPublicEvents({ limit: 6 });
        if (res.ok && res.data) {
          const list = Array.isArray(res.data.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];
          setEvents(list);
        }
      } catch (error) {
        console.error("Failed to load featured events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const formatMonth = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-US", { month: "short" }).toUpperCase();
    } catch {
      return "EVENT";
    }
  };

  const formatDay = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-US", { day: "2-digit" });
    } catch {
      return "01";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (!loading && events.length === 0) {
    return null; // Don't show section if no events exist
  }

  return (
    <section className="w-full bg-white py-16 md:py-20 border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Featured events
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-light">
              Hand-picked experiences you won&apos;t want to miss.
            </p>
          </div>

          <Link
            href="/events"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#4f46e5] hover:text-indigo-700 transition group"
          >
            See all
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
          {events.slice(0, 3).map((event) => {
            const displayImage =
              event.bannerImage ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600";

            return (
              <div
                key={event.id}
                className="bg-white border border-slate-100 hover:border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full group"
              >
                {/* Event Image & Date Badge */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={displayImage}
                    alt={event.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-2xl flex flex-col items-center justify-center shadow-md border border-slate-100/50 min-w-13.5 md:min-w-18">
                    <span className="text-[10px] font-bold tracking-wider text-[#4f46e5]">
                      {formatMonth(event.date)}
                    </span>
                    <span className="text-xl font-extrabold text-slate-800 leading-none mt-0.5">
                      {formatDay(event.date)}
                    </span>
                  </div>
                </div>

                {/* Event Details Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Category & Type Badges */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-indigo-50 text-[#4f46e5]">
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {event.category}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 bg-slate-100">
                        {event.eventType === "ONLINE" ? "Online" : "In-Person"}
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/events/${event.id}`}>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-[#4f46e5] transition duration-150 mb-4 line-clamp-2">
                        {event.title}
                      </h3>
                    </Link>

                    {/* Date and Location Rows */}
                    <div className="space-y-2.5 mb-6 text-slate-500 text-xs md:text-sm font-medium">
                      <div className="flex items-center gap-2">
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
                          className="h-4.5 w-4.5 text-slate-400"
                        >
                          <path d="M8 2v4" />
                          <path d="M16 2v4" />
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <path d="M3 10h18" />
                        </svg>
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="flex items-start gap-2">
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
                          className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Divider & Info */}
                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs md:text-sm font-medium">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>{event.availableSeats} seats left</span>
                    </div>

                    <Link
                      href={`/events/${event.id}`}
                      className="flex items-center gap-1 text-[#4f46e5] hover:text-indigo-700 transition font-semibold"
                    >
                      View details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
