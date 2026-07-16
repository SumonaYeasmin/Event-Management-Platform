import React from 'react'
import { Ban, Check, Search } from 'lucide-react'

interface OrganizerItem {
  id: string
  name: string
  email: string
  joined: string
  eventsCount: number
  status: 'Active' | 'Suspended'
  avatar: string
}

const organizersList: OrganizerItem[] = [
  {
    id: '1',
    name: 'Nova Events Co.',
    email: 'hello@novaevents.com',
    joined: 'Jun 10, 2025',
    eventsCount: 5,
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova'
  },
  {
    id: '2',
    name: 'Harmony Live',
    email: 'team@harmonylive.com',
    joined: 'Aug 1, 2025',
    eventsCount: 4,
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harmony'
  },
  {
    id: '3',
    name: 'Skillforge',
    email: 'learn@skillforge.io',
    joined: 'Oct 5, 2025',
    eventsCount: 3,
    status: 'Suspended',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Skillforge'
  }
]

export default function OrganizerManagementPage() {
  return (
    <div className="space-y-6 w-full">


      {/* Stats and Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs font-semibold text-slate-500">3 organizers total</p>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            className="w-full text-xs border border-slate-200 rounded-xl pl-9 pr-4 py-2 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Organizer</th>
                <th className="py-4 px-6">Joined</th>
                <th className="py-4 px-6">Events</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {organizersList.map((organizer) => {
                const isActive = organizer.status === 'Active';
                return (
                  <tr key={organizer.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Organizer Info (Avatar + Name/Email) */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={organizer.avatar} 
                          alt={organizer.name} 
                          className="h-9 w-9 rounded-full bg-slate-100 object-cover shrink-0 border border-slate-200/50"
                        />
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-slate-900 leading-none">
                            {organizer.name}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {organizer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                      {organizer.joined}
                    </td>

                    {/* Events Count */}
                    <td className="py-4 px-6 text-xs font-bold text-slate-800">
                      {organizer.eventsCount}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 w-fit ${
                        isActive 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />
                        {organizer.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end">
                        {isActive ? (
                          <button className="border border-slate-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition-colors text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer">
                            <Ban className="h-3.5 w-3.5 text-rose-400" />
                            Suspend
                          </button>
                        ) : (
                          <button className="border border-slate-200 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-600 transition-colors text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer">
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}