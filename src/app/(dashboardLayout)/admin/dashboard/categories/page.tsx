import React from 'react'
import { Tag, Pencil, Trash2, Plus } from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  count: string
  colorClass: string
  iconColorClass: string
}

const categoriesList: CategoryItem[] = [
  {
    id: '1',
    name: 'Technology',
    count: '3 events',
    colorClass: 'bg-indigo-50 text-indigo-600',
    iconColorClass: 'text-indigo-600'
  },
  {
    id: '2',
    name: 'Business',
    count: '3 events',
    colorClass: 'bg-sky-50 text-sky-600',
    iconColorClass: 'text-sky-600'
  },
  {
    id: '3',
    name: 'Education',
    count: '2 events',
    colorClass: 'bg-emerald-50 text-emerald-600',
    iconColorClass: 'text-emerald-600'
  },
  {
    id: '4',
    name: 'Music',
    count: '1 events',
    colorClass: 'bg-rose-50 text-rose-600',
    iconColorClass: 'text-rose-600'
  },
  {
    id: '5',
    name: 'Sports',
    count: '1 events',
    colorClass: 'bg-amber-50 text-amber-600',
    iconColorClass: 'text-amber-600'
  },
  {
    id: '6',
    name: 'Health',
    count: '1 events',
    colorClass: 'bg-teal-50 text-teal-600',
    iconColorClass: 'text-teal-600'
  },
  {
    id: '7',
    name: 'Workshop',
    count: '1 events',
    colorClass: 'bg-purple-50 text-purple-600',
    iconColorClass: 'text-purple-600'
  },
  {
    id: '8',
    name: 'Conference',
    count: '1 events',
    colorClass: 'bg-blue-50 text-blue-600',
    iconColorClass: 'text-blue-600'
  }
]

export default function CategoriesPage() {
  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">
            8 categories · organizers choose from these
          </p>
        </div>
        
        {/* New Category Button */}
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm text-xs cursor-pointer self-start sm:self-auto transition-all active:scale-95">
          <Plus className="h-4 w-4" />
          New category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoriesList.map((category) => (
          <div 
            key={category.id}
            className="flex items-center justify-between p-5 rounded-2xl border  bg-white hover:shadow-md transition-all duration-200 group border-slate-200"
          >
            {/* Tag Icon & Details */}
            <div className="flex items-center gap-4">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${category.colorClass}`}>
                <Tag className={`h-5 w-5 ${category.iconColorClass}`} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-800 leading-none">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {category.count}
                </p>
              </div>
            </div>

            {/* Actions (Pencil & Trash) */}
            <div className="flex items-center gap-3.5 text-slate-400">
              <button className="hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-slate-50 cursor-pointer">
                <Pencil className="h-4 w-4" />
              </button>
              <button className="hover:text-rose-600 transition-colors p-1 rounded-md hover:bg-slate-50 cursor-pointer">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}