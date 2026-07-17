import React from 'react'
import { Ban, Check, Search } from 'lucide-react'

interface UserItem {
  id: string
  name: string
  email: string
  joined: string
  registrations: number
  status: 'Active' | 'Suspended'
  avatar: string
}

const usersList: UserItem[] = [
  {
    id: '1',
    name: 'Aisha Rahman',
    email: 'aisha@example.com',
    joined: 'Nov 2, 2025',
    registrations: 4,
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha'
  },
  {
    id: '2',
    name: 'Marcus Lee',
    email: 'marcus@example.com',
    joined: 'Jan 14, 2026',
    registrations: 3,
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
  },
  {
    id: '3',
    name: 'Priya Nair',
    email: 'priya@example.com',
    joined: 'Sep 20, 2025',
    registrations: 0,
    status: 'Suspended',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  }
]

export default function UserManagementPage() {
  return (
    <div className="space-y-6 w-full">


      {/* Stats and Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs font-semibold text-slate-500">3 users total</p>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            className="w-full text-xs border border-slate-200 rounded-xl pl-9 pr-4 py-2 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Mobile Card List (Visible only on mobile/tablet) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {usersList.map((user) => {
          const isActive = user.status === 'Active';
          return (
            <div key={user.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
              {/* Header: Avatar & Info */}
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-10 w-10 rounded-full bg-slate-100 object-cover border border-slate-200/50"
                />
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900 leading-none">{user.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{user.email}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 text-xs font-semibold">
                <div>
                  <span className="text-slate-400 block font-normal text-[10px] uppercase mb-0.5">Joined</span>
                  <span className="text-slate-700">{user.joined}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-normal text-[10px] uppercase mb-0.5">Registrations</span>
                  <span className="text-slate-850">{user.registrations}</span>
                </div>
              </div>

              {/* Footer: Status and Action Button */}
              <div className="flex items-center justify-between pt-1">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 w-fit ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  {user.status}
                </span>

                <div>
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
              </div>
            </div>
          )
        })}
      </div>

      {/* Table Container (Visible only on desktop) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Joined</th>
                <th className="py-4 px-6">Registrations</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((user) => {
                const isActive = user.status === 'Active';
                return (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* User Info (Avatar + Name/Email) */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="h-9 w-9 rounded-full bg-slate-100 object-cover shrink-0 border border-slate-200/50"
                        />
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-slate-900 leading-none">
                            {user.name}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                      {user.joined}
                    </td>

                    {/* Registration Count */}
                    <td className="py-4 px-6 text-xs font-bold text-slate-800">
                      {user.registrations}
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
                        {user.status}
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