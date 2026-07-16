
import { Users, Building2, Calendar, Ticket, ArrowRight, Check, X } from 'lucide-react'
import Link from 'next/link'

export default function PlatformOverviewPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor everything happening across EventHub.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Users */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Total users</span>
            <h3 className="text-3xl font-bold text-slate-900">3</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Organizers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Organizers</span>
            <h3 className="text-3xl font-bold text-slate-900">3</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Total Events */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Total events</span>
            <h3 className="text-3xl font-bold text-slate-900">12</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Registrations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Registrations</span>
            <h3 className="text-3xl font-bold text-slate-900">7</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Ticket className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pending approvals</h2>
            <p className="text-xs text-slate-400 mt-0.5">1 event awaiting review</p>
          </div>
          <Link href="/admin/dashboard/pending-approvals" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
            Review all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Pending Events List */}
        <div className="divide-y divide-slate-100">
          {/* Event 1 */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=150"
                alt="Event cover"
                className="h-12 w-20 rounded-lg object-cover bg-slate-100 shrink-0"
              />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors leading-tight">
                  Regional Startup Pitch Night
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Nova Events Co. · Business · Sep 12, 2026
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-xs shadow-xs">
                <Check className="h-3.5 w-3.5" />
                Approve
              </button>
              <button className="border border-slate-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 text-slate-600 font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-xs">
                <X className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
