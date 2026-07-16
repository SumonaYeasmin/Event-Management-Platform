import React from 'react'
import { ArrowLeft, Send, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function CreateEventPage() {
  return (
    <div className="space-y-6 w-full">
      {/* Back to my events Link */}
      <div>
        <Link 
          href="/organizer/dashboard/my-events" 
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to my events
        </Link>
      </div>



      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Basic details</h2>
            
            <div className="space-y-4">
              {/* Event Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Event title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Conf 2026" 
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 placeholder-slate-400"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <textarea 
                  rows={4}
                  placeholder="What is this event about?" 
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 placeholder-slate-400 resize-none"
                />
              </div>

              {/* Category & Event Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white text-slate-700">
                    <option value="">Select category</option>
                    <option value="technology">Technology</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="music">Music</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Event type</label>
                  <select className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white text-slate-700">
                    <option value="">Select type</option>
                    <option value="in-person">In-person</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Schedule & Location */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Schedule & location</h2>
            
            <div className="space-y-4">
              {/* Event Date & Registration Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Event date</label>
                  <input 
                    type="date" 
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Registration deadline</label>
                  <input 
                    type="date" 
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-500"
                  />
                </div>
              </div>

              {/* Start Time & End Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Start time</label>
                  <input 
                    type="time" 
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">End time</label>
                  <input 
                    type="time" 
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-500"
                  />
                </div>
              </div>

              {/* Venue / Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Venue / location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Convention Center Hall A" 
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 placeholder-slate-400"
                />
              </div>

              {/* Maximum Participants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Maximum participants</label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="e.g. 500" 
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 placeholder-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Actions */}
        <div className="space-y-6">
          {/* Card 1: Cover Image Upload */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Cover image</h3>
            
            <div className="space-y-3.5">
              {/* Cover Image Preview */}
              <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400" 
                  alt="Event cover preview" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Upload Button */}
              <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
                <ImageIcon className="h-4 w-4" />
                Choose a cover
              </button>

              {/* Cover Thumbnails Grid */}
              <div className="grid grid-cols-4 gap-2.5 pt-1">
                {[
                  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=150',
                  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=150',
                  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=150',
                  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=150'
                ].map((thumb, idx) => (
                  <button 
                    key={idx} 
                    className={`h-10 w-full rounded-lg overflow-hidden border-2 cursor-pointer active:scale-95 transition-all ${
                      idx === 1 ? 'border-indigo-500' : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img src={thumb} alt="thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Publish Settings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Publish</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Events go live only after admin approval. Save a draft or submit for review.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {/* Submit for approval */}
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 w-full cursor-pointer shadow-sm shadow-indigo-600/10 active:scale-98 transition-all text-xs">
                <Send className="h-3.5 w-3.5" />
                Submit for approval
              </button>

              {/* Save as Draft */}
              <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 w-full cursor-pointer active:scale-98 transition-all text-xs">
                <Save className="h-3.5 w-3.5 text-slate-400" />
                Save as draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}