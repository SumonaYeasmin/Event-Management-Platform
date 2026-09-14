"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Bookmark,
  ArrowRight,
  Loader2,
  BookmarkX,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getMyFavorites,
  removeEventFromFavorites,
} from "@/src/services/event.service";

export default function SaveEventsPage() {
  const [savedEvents, setSavedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // ১. ইউজারের সেভ করা সমস্ত ফেভারিট ইভেন্ট ডাটাবেজ থেকে লোড করা
  const fetchSavedEvents = async () => {
    try {
      setLoading(true);
      const res = await getMyFavorites();

      if (res.ok && res.data) {
        if (Array.isArray(res.data.data)) {
          setSavedEvents(res.data.data);
        } else if (Array.isArray(res.data)) {
          setSavedEvents(res.data);
        }
      }
    } catch (error) {
      console.error("Failed to load saved events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedEvents();
  }, []);

  // ২. ফেভারিট থেকে ইভেন্ট আন-সেভ / রিমুভ করা
  const handleRemoveFavorite = async (id: string, title: string) => {
    try {
      setRemovingId(id);
      const res = await removeEventFromFavorites(id);

      if (res.ok) {
        toast.success(`'${title}' removed from saved events`);
        setSavedEvents((prev) => prev.filter((event) => event.id !== id));
      } else {
        toast.error(res.data?.message || "Failed to remove event");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to remove event");
    } finally {
      setRemovingId(null);
    }
  };

  // তারিখ ও মাস
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

  return (
    <div className="space-y-6 w-full">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Saved Events</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Events you have bookmarked to attend or review later.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Loading saved events...</p>
        </div>
      ) : savedEvents.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Bookmark className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No saved events yet</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              You haven't bookmarked any events. Explore upcoming events on the homepage and click &quot;Save to Favorites&quot; to add them here!
            </p>
          </div>
          <Link
            href="/"
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-600/20"
          >
            Explore Events
          </Link>
        </div>
      ) : (
        /* Events Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedEvents.map((event) => {
            const isRemoving = removingId === event.id;
            const displayImage =
              event.bannerImage ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400";

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group justify-between"
              >
                <div>
                  {/* Card Image Cover */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={displayImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Month/Day Badge */}
                    <div className="absolute top-4 left-4 rounded-xl bg-white/95 p-1 px-2.5 flex flex-col items-center justify-center shadow-xs border border-white/20 min-w-12 h-13">
                      <span className="text-[10px] font-extrabold text-indigo-600 tracking-wider">
                        {formatMonth(event.date)}
                      </span>
                      <span className="text-base font-bold text-slate-800 leading-tight">
                        {formatDay(event.date)}
                      </span>
                    </div>

                    {/* Bookmark Remove Button */}
                    <button
                      disabled={isRemoving}
                      onClick={() => handleRemoveFavorite(event.id, event.title)}
                      className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-xs border border-slate-100 cursor-pointer hover:bg-rose-50 hover:text-rose-600 active:scale-95 transition-all"
                      title="Remove from saved events"
                    >
                      {isRemoving ? (
                        <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                      ) : (
                        <Bookmark className="h-4 w-4 fill-indigo-600 text-indigo-600" />
                      )}
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-3">
                      {/* Badges */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-100">
                          {event.category}
                        </span>

                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                          {event.eventType === "ONLINE" ? "Online" : "In-Person"}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/events/${event.id}`}>
                        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors">
                          {event.title}
                        </h3>
                      </Link>

                      {/* Event Details */}
                      <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Info & View details link */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>{event.availableSeats} seats left</span>
                    </div>

                    <Link
                      href={`/events/${event.id}`}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors text-xs font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      View details
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}