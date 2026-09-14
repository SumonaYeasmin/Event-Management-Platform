"use client";

import React, { useState, useEffect } from "react";
import { Users, Edit, Eye, Plus, Calendar, MapPin, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { getMyEvents, OrganizerEventItem } from "@/src/services/event.service";

type FilterStatus = "All" | "Draft" | "Pending" | "Published" | "Rejected" | "Completed";

export default function MyEventsPage() {
  const [events, setEvents] = useState<OrganizerEventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");

  // Fetch organizer events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getMyEvents();
      if (res.ok && Array.isArray(res.data)) {
        setEvents(res.data);
      } else if (res.ok && res.data?.data && Array.isArray(res.data.data)) {
        setEvents(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load organizer events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Helper to format date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Status mapping helper
  const mapBackendStatus = (status: string): FilterStatus => {
    const s = status.toUpperCase();
    if (s === "DRAFT") return "Draft";
    if (s === "PENDING") return "Pending";
    if (s === "PUBLISHED") return "Published";
    if (s === "REJECTED") return "Rejected";
    if (s === "COMPLETED") return "Completed";
    return "Published";
  };

  // Status count helper
  const getCount = (status: FilterStatus) => {
    if (status === "All") return events.length;
    return events.filter((e) => mapBackendStatus(e.status) === status).length;
  };

  // Filtered list
  const filteredEvents = events.filter((event) => {
    if (activeFilter === "All") return true;
    return mapBackendStatus(event.status) === activeFilter;
  });

  const filterOptions: FilterStatus[] = [
    "All",
    "Draft",
    "Pending",
    "Published",
    "Rejected",
    "Completed",
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Filter Badges and Create Event Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option;
            const count = getCount(option);
            return (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 flex items-center gap-1.5",
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900"
                )}
              >
                <span>{option}</span>
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-md font-bold",
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Create Event Button */}
        <Link
          href="/organizer/dashboard/create-event"
          className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/10 cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create event
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Loading your events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              {activeFilter === "All" ? "No events found" : `No ${activeFilter.toLowerCase()} events`}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm">
              {activeFilter === "All"
                ? "You haven't created any events yet. Click below to create your first event!"
                : `There are currently no events matching the "${activeFilter}" filter.`}
            </p>
          </div>
          {activeFilter === "All" && (
            <Link
              href="/organizer/dashboard/create-event"
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-600/20"
            >
              <Plus className="h-4 w-4" />
              Create your first event
            </Link>
          )}
        </div>
      ) : (
        /* Events List */
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const formattedStatus = mapBackendStatus(event.status);
            const isCompleted = formattedStatus === "Completed";
            const isPending = formattedStatus === "Pending";
            const isDraft = formattedStatus === "Draft";
            const isRejected = formattedStatus === "Rejected";
            const isPublished = formattedStatus === "Published";

            const registeredCount =
              event.registrations && Array.isArray(event.registrations)
                ? event.registrations.length
                : (event.totalSeats || 0) - (event.availableSeats || 0);

            const displayImage =
              event.bannerImage ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400";

            return (
              <div
                key={event.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row items-start lg:items-center gap-4"
              >
                {/* Event Image */}
                <img
                  src={displayImage}
                  alt={event.title}
                  className="w-full lg:w-44 h-36 rounded-xl object-cover bg-slate-100 shrink-0"
                />

                {/* Event Info */}
                <div className="flex-1 space-y-2">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                        isPublished
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isPending
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : isDraft
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : isRejected
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isPublished
                            ? "bg-emerald-500"
                            : isPending
                            ? "bg-amber-500 animate-pulse"
                            : isDraft
                            ? "bg-slate-400"
                            : isRejected
                            ? "bg-red-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {formattedStatus}
                    </span>

                    {/* Category Badge */}
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-100">
                      {event.category}
                    </span>

                    {/* Event Type Badge */}
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-sky-50 text-sky-600 border-sky-100">
                      {event.eventType === "ONLINE" ? "Online" : "In-Person"}
                    </span>

                    {event.isFeatured && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-purple-50 text-purple-600 border-purple-100 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Event Title */}
                  <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                    {event.title}
                  </h3>

                  {/* Date, Location & Seats */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs md:text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      {registeredCount}/{event.totalSeats} registered
                    </span>
                    <span className="font-semibold text-slate-700">
                      {event.ticketPrice > 0 ? `$${event.ticketPrice}` : "Free"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end shrink-0 pt-2 lg:pt-0">
                  <Link
                    href={`/events/${event.id}`}
                    target="_blank"
                    className="border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    Public Page
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}