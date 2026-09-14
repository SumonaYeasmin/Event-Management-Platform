"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Check,
  X,
  Search,
  Loader2,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { cn } from "@/src/lib/utils";
import {
  getAllEventsForAdmin,
  approveEventByAdmin,
  rejectEventByAdmin,
  cancelEventByAdmin,
  deleteEventByAdmin,
  AdminEventItem,
} from "@/src/services/event.service";

type FilterStatus = "All" | "Published" | "Pending" | "Rejected" | "Draft" | "Completed";

export default function AllEventsPage() {
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // ১. ব্যাকএন্ড থেকে সমস্ত ইভেন্ট ফেচ করা
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getAllEventsForAdmin({
        status: activeFilter === "All" ? undefined : activeFilter,
        search: searchQuery.trim() || undefined,
      });

      if (res.ok && res.data) {
        if (Array.isArray(res.data.data)) {
          setEvents(res.data.data);
        } else if (Array.isArray(res.data)) {
          setEvents(res.data);
        }
      } else {
        toast.error(res.data?.message || "Failed to load events");
      }
    } catch (error: any) {
      console.error("Error fetching admin events:", error);
      toast.error(error.message || "Something went wrong fetching events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeFilter]);

  // সার্চ হ্যান্ডলার
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  // ২. ইভেন্ট অ্যাপ্রুভ (Approve) করা
  const handleApprove = async (id: string, title: string) => {
    try {
      setActionLoadingId(id);
      const res = await approveEventByAdmin(id);
      if (res.ok) {
        toast.success(`'${title}' approved and published!`);
        fetchEvents();
      } else {
        toast.error(res.data?.message || "Failed to approve event");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to approve event");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ৩. ইভেন্ট রিজেক্ট (Reject) করা
  const handleReject = async (id: string, title: string) => {
    try {
      setActionLoadingId(id);
      const res = await rejectEventByAdmin(id);
      if (res.ok) {
        toast.success(`'${title}' rejected!`);
        fetchEvents();
      } else {
        toast.error(res.data?.message || "Failed to reject event");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to reject event");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ৪. ইভেন্ট আনপাবলিশ / ক্যান্সেল করা
  const handleCancel = async (id: string, title: string) => {
    try {
      setActionLoadingId(id);
      const res = await cancelEventByAdmin(id);
      if (res.ok) {
        toast.success(`'${title}' unpublished!`);
        fetchEvents();
      } else {
        toast.error(res.data?.message || "Failed to unpublish event");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to unpublish event");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ৫. ইভেন্ট ডিলিট করা
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete '${title}'?`)) {
      return;
    }
    try {
      setActionLoadingId(id);
      const res = await deleteEventByAdmin(id);
      if (res.ok) {
        toast.success(`'${title}' deleted permanently!`);
        fetchEvents();
      } else {
        toast.error(res.data?.message || "Failed to delete event");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete event");
    } finally {
      setActionLoadingId(null);
    }
  };

  // তারিখ ফরম্যাট
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

  // স্ট্যাটাস ম্যাপিং
  const mapBackendStatus = (status: string): FilterStatus => {
    const s = status.toUpperCase();
    if (s === "DRAFT") return "Draft";
    if (s === "PENDING") return "Pending";
    if (s === "PUBLISHED") return "Published";
    if (s === "REJECTED") return "Rejected";
    if (s === "COMPLETED") return "Completed";
    return "Published";
  };

  const filterOptions: FilterStatus[] = [
    "All",
    "Published",
    "Pending",
    "Rejected",
    "Draft",
    "Completed",
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Header with Search and Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option;
            return (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150",
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/10"
                    : "bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events or location..."
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white placeholder-slate-400"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        </form>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              {activeFilter === "All" ? "No events found" : `No ${activeFilter.toLowerCase()} events`}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              {searchQuery
                ? `No events matching "${searchQuery}".`
                : `There are currently no events matching the "${activeFilter}" filter.`}
            </p>
          </div>
        </div>
      ) : (
        /* Events List */
        <div className="space-y-4">
          {events.map((event) => {
            const formattedStatus = mapBackendStatus(event.status);
            const isPublished = formattedStatus === "Published";
            const isPending = formattedStatus === "Pending";
            const isDraft = formattedStatus === "Draft";
            const isRejected = formattedStatus === "Rejected";
            const isCompleted = formattedStatus === "Completed";
            const isActionLoading = actionLoadingId === event.id;

            const displayImage =
              event.bannerImage ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400";

            return (
              <div
                key={event.id}
                className="bg-white p-4 lg:p-5 rounded-xl md:rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row items-start lg:items-center gap-4"
              >
                {/* Event Cover Image */}
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
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
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
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-100">
                      {event.category}
                    </span>

                    {/* Event Type */}
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-sky-50 text-sky-600 border-sky-100">
                      {event.eventType === "ONLINE" ? "Online" : "In-Person"}
                    </span>

                    {event.isFeatured && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-purple-50 text-purple-600 border-purple-100 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Event Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {event.title}
                  </h3>

                  {/* Organizer, Date & Details */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 font-medium">
                    <span className="font-semibold text-slate-700">
                      Organizer: {event.organizer?.name || "Unknown"} ({event.organizer?.email || "N/A"})
                    </span>
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
                      {event.totalSeats} seats
                    </span>
                    <span className="font-semibold text-slate-700">
                      {event.ticketPrice > 0 ? `$${event.ticketPrice}` : "Free"}
                    </span>
                  </div>
                </div>

                {/* Admin Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end shrink-0 pt-2 lg:pt-0">
                  {/* Pending Actions: Approve & Reject */}
                  {isPending && (
                    <>
                      <button
                        disabled={isActionLoading}
                        onClick={() => handleApprove(event.id, event.title)}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-xs shadow-xs"
                      >
                        {isActionLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        Approve
                      </button>

                      <button
                        disabled={isActionLoading}
                        onClick={() => handleReject(event.id, event.title)}
                        className="border border-red-200 hover:bg-red-50 text-red-600 font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-xs"
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </>
                  )}

                  {/* Published Actions: Unpublish / Cancel */}
                  {isPublished && (
                    <button
                      disabled={isActionLoading}
                      onClick={() => handleCancel(event.id, event.title)}
                      className="border border-amber-200 hover:bg-amber-50 text-amber-600 transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <EyeOff className="h-3.5 w-3.5 text-amber-500" />
                      Unpublish
                    </button>
                  )}

                  {/* Public Details View Link */}
                  <Link
                    href={`/events/${event.id}`}
                    target="_blank"
                    className="border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    View
                  </Link>

                  {/* Delete Button */}
                  <button
                    disabled={isActionLoading}
                    onClick={() => handleDelete(event.id, event.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100"
                    title="Delete event permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}