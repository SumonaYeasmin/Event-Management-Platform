"use client";

import React, { useState } from "react";
import { ArrowLeft, Send, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createEvent, CreateEventPayload } from "@/src/services/event.service";

const PRESET_COVERS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600",
];

export default function CreateEventPage() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [eventType, setEventType] = useState<"IN_PERSON" | "ONLINE">("IN_PERSON");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("18:00");
  const [location, setLocation] = useState("");
  const [totalSeats, setTotalSeats] = useState<number | "">("");
  const [ticketPrice, setTicketPrice] = useState<number | "">(0);
  const [bannerImage, setBannerImage] = useState(PRESET_COVERS[0]);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Loading state
  const [submitting, setSubmitting] = useState(false);
  const [submittingType, setSubmittingType] = useState<"PENDING" | "DRAFT" | null>(null);

  // Helper to format ISO Date
  const combineDateAndTime = (dateStr: string, timeStr: string): string => {
    if (!dateStr) return "";
    const time = timeStr || "00:00";
    const dateObj = new Date(`${dateStr}T${time}:00`);
    return dateObj.toISOString();
  };

  // Form Submission Handler
  const handleSubmit = async (status: "PENDING" | "DRAFT") => {
    // 1. Basic Validation
    if (!title.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter an event description");
      return;
    }
    if (!category) {
      toast.error("Please select an event category");
      return;
    }
    if (!eventDate) {
      toast.error("Please select an event date");
      return;
    }
    if (!location.trim()) {
      toast.error(
        eventType === "ONLINE"
          ? "Please provide an online meeting link (e.g., Zoom/Meet)"
          : "Please provide a venue / location"
      );
      return;
    }
    if (!totalSeats || Number(totalSeats) < 1) {
      toast.error("Please enter a valid total seats number (minimum 1)");
      return;
    }

    try {
      setSubmitting(true);
      setSubmittingType(status);

      const startIsoDate = combineDateAndTime(eventDate, startTime);
      const endIsoDate = endDate ? combineDateAndTime(endDate, endTime) : undefined;

      const payload: CreateEventPayload = {
        title: title.trim(),
        description: description.trim(),
        category,
        eventType,
        date: startIsoDate,
        endDate: endIsoDate,
        location: location.trim(),
        totalSeats: Number(totalSeats),
        ticketPrice: ticketPrice === "" ? 0 : Number(ticketPrice),
        bannerImage: bannerImage.trim() || undefined,
        isFeatured,
        status,
      };

      const res = await createEvent(payload);

      if (res.ok) {
        if (status === "PENDING") {
          toast.success("Event submitted successfully! Waiting for admin approval.");
        } else {
          toast.success("Event saved as draft successfully!");
        }
        router.push("/organizer/dashboard/my-events");
      } else {
        const errorMsg =
          res.data?.message ||
          (Array.isArray(res.data?.message) ? res.data?.message[0] : null) ||
          "Failed to create event";
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setSubmittingType(null);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Back to my events Link */}
      <div>
        <Link
          href="/organizer/dashboard/my-events"
          className="text-base font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my events
        </Link>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Basic details
            </h2>

            <div className="space-y-4">
              {/* Event Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Event title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. NextGen Tech Summit 2026"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 text-slate-900 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event, speakers, what attendees will learn, etc."
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 resize-none text-slate-900 transition-all"
                />
              </div>

              {/* Category & Event Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white text-slate-700 transition-all"
                  >
                    <option value="">Select category</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Music">Music</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Event type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as "IN_PERSON" | "ONLINE")}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white text-slate-700 transition-all"
                  >
                    <option value="IN_PERSON">In-person</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Schedule & Location */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Schedule & Location
            </h2>

            <div className="space-y-4">
              {/* Event Date & Start Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Event Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* End Date & End Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Event End Date <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Venue / Location */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  {eventType === "ONLINE" ? "Meeting Link / Platform" : "Venue / Location"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={
                    eventType === "ONLINE"
                      ? "e.g. https://meet.google.com/xyz-abcd-efg or Zoom link"
                      : "e.g. Metro Convention Center, Hall A, Dhaka"
                  }
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 text-slate-900 transition-all"
                />
              </div>

              {/* Capacity & Ticket Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Total Capacity / Seats <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 200"
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 text-slate-900 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Ticket Price ($) <span className="text-xs text-slate-400 font-normal">(0 for Free)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 text-slate-900 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Actions */}
        <div className="space-y-6">
          {/* Card 1: Cover Image Upload / Selection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">
              Cover Image
            </h3>

            <div className="space-y-3.5">
              {/* Cover Image Preview */}
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100 shadow-inner">
                {bannerImage ? (
                  <img
                    src={bannerImage}
                    alt="Event cover preview"
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <ImageIcon className="h-8 w-8 text-slate-300" />
                    <span className="text-xs">No cover selected</span>
                  </div>
                )}
              </div>

              {/* Select Preset Thumbnails */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Choose from gallery:</label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_COVERS.map((thumb, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBannerImage(thumb)}
                      className={`h-11 w-full rounded-lg overflow-hidden border-2 cursor-pointer active:scale-95 transition-all ${
                        bannerImage === thumb
                          ? "border-indigo-600 ring-2 ring-indigo-600/30 scale-102"
                          : "border-transparent opacity-75 hover:opacity-100 hover:border-slate-300"
                      }`}
                    >
                      <img src={thumb} alt={`Preset ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomUrlInput(!showCustomUrlInput)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  {showCustomUrlInput ? "Hide custom image URL" : "Paste custom image URL"}
                </button>

                {showCustomUrlInput && (
                  <div className="mt-2.5 space-y-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => {
                        setCustomImageUrl(e.target.value);
                        if (e.target.value.trim()) {
                          setBannerImage(e.target.value.trim());
                        }
                      }}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 placeholder-slate-400 text-slate-800"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Publish Settings & Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Publish</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Events go live only after admin approval. Save a draft or submit for review.
              </p>
            </div>

            {/* Featured Event Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer pt-1 pb-1">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-700">
                Request to feature on homepage
              </span>
            </label>

            <div className="space-y-2.5 pt-1">
              {/* Submit for approval */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit("PENDING")}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 w-full cursor-pointer shadow-sm shadow-indigo-600/10 active:scale-98 transition-all text-sm"
              >
                {submitting && submittingType === "PENDING" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit for approval
                  </>
                )}
              </button>

              {/* Save as Draft */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit("DRAFT")}
                className="border border-slate-200 hover:bg-slate-50 disabled:bg-slate-100 text-slate-700 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 w-full cursor-pointer active:scale-98 transition-all text-sm"
              >
                {submitting && submittingType === "DRAFT" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving draft...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-slate-500" />
                    Save as draft
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}