"use client";

import React, { useState, useEffect } from "react";
import { Ticket, CalendarDays, Bookmark, Clock, ArrowRight, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { getMyRegistrations, getMyFavorites } from "@/src/services/event.service";

export default function OverviewPage() {
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const [regRes, favRes] = await Promise.all([
          getMyRegistrations(),
          getMyFavorites(),
        ]);

        if (regRes.ok && regRes.data) {
          const list = Array.isArray(regRes.data.data)
            ? regRes.data.data
            : Array.isArray(regRes.data)
            ? regRes.data
            : [];
          setRegisteredEvents(list);
        }

        if (favRes.ok && favRes.data) {
          const favList = Array.isArray(favRes.data.data)
            ? favRes.data.data
            : Array.isArray(favRes.data)
            ? favRes.data
            : [];
          setSavedCount(favList.length);
        }
      } catch (error) {
        console.error("Error loading user overview stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

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
    <div className="space-y-6 md:space-y-8 mx-auto w-full">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          Welcome back 👋
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Here&apos;s what&apos;s coming up and what you&apos;ve saved.
        </p>
      </div>

      {/* 2. Responsive Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Registered Events */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs md:text-sm font-medium text-slate-500">Registered events</span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-indigo-600" /> : registeredEvents.length}
            </h3>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Ticket className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>

        {/* Card 2: Upcoming Registered */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs md:text-sm font-medium text-slate-500">Upcoming tickets</span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-emerald-600" /> : registeredEvents.length}
            </h3>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CalendarDays className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>

        {/* Card 3: Saved Events */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-xs md:text-sm font-medium text-slate-500">Saved events</span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-amber-600" /> : savedCount}
            </h3>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Bookmark className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>
      </div>

      {/* 3. Upcoming Events Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold text-slate-900">Your upcoming registered events</h2>
          <Link
            href="/dashboard/register-events"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            View all tickets <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="py-8 flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span className="text-xs">Loading your tickets...</span>
          </div>
        ) : registeredEvents.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
            <Calendar className="h-8 w-8 text-slate-300" />
            <p className="text-xs font-medium text-slate-600">No registered events yet.</p>
            <Link
              href="/"
              className="text-xs text-indigo-600 font-semibold hover:underline mt-1"
            >
              Browse upcoming events ➔
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {registeredEvents.slice(0, 3).map((item) => {
              const event = item.event || item;
              const displayImage =
                event.bannerImage ||
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=150";

              return (
                <div
                  key={item.registrationId || event.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <img
                      src={displayImage}
                      alt={event.title}
                      className="h-14 w-20 lg:h-16 lg:w-24 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <Link href={`/events/${event.id}`}>
                        <h4 className="text-xs md:text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors line-clamp-1">
                          {event.title}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span>{formatDate(event.date)}</span>
                        <span>·</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto">
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}